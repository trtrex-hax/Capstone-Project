const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Minimal input cleanup: remove empty strings so Mongoose doesn't choke on Date/ObjectId casts
const cleanBody = (body) => {
  const b = { ...body };
  if (b.deadline === '' || b.deadline === null) delete b.deadline;
  if (b.assignedTo === '' || b.assignedTo === null) delete b.assignedTo;
  if (b.project === '' || b.project === null) delete b.project;
  return b;
};

// @desc    Get all tasks for a project or user (role-based)
// @route   GET /api/tasks
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query;
    const { projectId } = req.query;

    if (projectId) {
      if (!isValidId(projectId)) {
        return res.status(400).json({ success: false, message: 'Invalid projectId' });
      }

      // Get tasks for specific project
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      // Check if user has access to this project
      const isAdmin = req.user.role === 'admin';
      const isLead = project.researchLead?.toString() === req.user._id.toString();
      const isMember = Array.isArray(project.teamMembers)
        ? project.teamMembers.some((member) => member.toString() === req.user._id.toString())
        : false;

      if (!isAdmin && !isLead && !isMember) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access tasks for this project'
        });
      }

      query = Task.find({ project: projectId });
    } else {
      // Get tasks visible to current user
      if (req.user.role === 'admin') {
        query = Task.find();
      } else if (req.user.role === 'research_lead') {
        // Research leads see tasks from their projects
        const leadProjects = await Project.find({ researchLead: req.user._id }).select('_id');
        const projectIds = leadProjects.map((p) => p._id);
        query = Task.find({ project: { $in: projectIds } });
      } else {
        // Team members see only their assigned tasks
        query = Task.find({ assignedTo: req.user._id });
      }
    }

    const tasks = await query
      .populate('project', 'title description') // keep original shape
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid task id' });
    }

    const task = await Task.findById(id)
      .populate('project', 'title description researchLead teamMembers')
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to this task
    const project = task.project;
    if (!project) {
      return res.status(400).json({
        success: false,
        message: 'Task has no project reference'
      });
    }

    const isAdmin = req.user.role === 'admin';
    const isAssignee = task.assignedTo && task.assignedTo._id?.toString() === req.user._id.toString();
    const isMember = Array.isArray(project.teamMembers)
      ? project.teamMembers.some((member) => member.toString() === req.user._id.toString())
      : false;
    const isLead = project.researchLead?.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignee && !isMember && !isLead) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    return res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('GET /api/tasks/:id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private (Research Leads and Admins)
router.post('/', protect, authorize('research_lead', 'admin'), async (req, res) => {
  try {
    const body = cleanBody(req.body);

    // Ensure required fields
    if (!body.title || !body.project) {
      return res.status(400).json({ success: false, message: 'title and project are required' });
    }
    if (!isValidId(body.project)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    // Add assignedBy
    body.assignedBy = req.user._id;

    const task = await Task.create(body);

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'title description')
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    return res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid task id' });
    }

    let task = await Task.findById(id).populate('project', 'researchLead teamMembers');
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Authorization check
    const isAdmin = req.user.role === 'admin';
    const isProjectLead = task.project && task.project.researchLead?.toString() === req.user._id.toString();
    const isAssignedUser = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    const body = cleanBody(req.body);

    if (isAssignedUser && !isProjectLead && !isAdmin) {
      // Team members can only update status and actualHours and comments
      const allowedUpdates = {};
      if (body.status !== undefined) allowedUpdates.status = body.status;
      if (body.actualHours !== undefined) allowedUpdates.actualHours = body.actualHours;
      if (body.comments !== undefined) allowedUpdates.comments = body.comments;

      task = await Task.findByIdAndUpdate(id, allowedUpdates, {
        new: true,
        runValidators: true
      });
    } else if (isProjectLead || isAdmin) {
      // Project leads and admins can update all fields
      task = await Task.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'title description')
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    return res.json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    console.error('PUT /api/tasks/:id error:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Research Lead of project or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid task id' });
    }

    const task = await Task.findById(id).populate('project', 'researchLead');
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is authorized to delete
    const isAdmin = req.user.role === 'admin';
    const isLead = task.project && task.project.researchLead?.toString() === req.user._id.toString();

    if (!isAdmin && !isLead) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await Task.findByIdAndDelete(id);

    return res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('DELETE /api/tasks/:id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;