// backend/routes/projects.js
const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Normalize goals from client into [{ description, isCompleted, deadline }]
function normalizeGoals(input) {
  if (!input) return [];
  // If already array of objects
  if (Array.isArray(input) && input.length && typeof input[0] === 'object') {
    return input
      .map(g => ({
        description: g?.description ? String(g.description).trim() : '',
        isCompleted: !!g?.isCompleted,
        deadline: g?.deadline ? new Date(g.deadline) : undefined
      }))
      .filter(g => g.description.length > 0);
  }
  // If array of strings
  if (Array.isArray(input) && typeof input[0] === 'string') {
    return input
      .map(s => String(s).trim())
      .filter(Boolean)
      .map(description => ({ description, isCompleted: false }));
  }
  // If single multiline string
  if (typeof input === 'string') {
    return input
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map(description => ({ description, isCompleted: false }));
  }
  return [];
}

// Clean/sanitize body to avoid casting errors
function cleanBody(body) {
  const b = { ...body };
  if (b.deadline === '' || b.deadline === null) delete b.deadline;
  if (b.deadline) b.deadline = new Date(b.deadline);
  if (b.title !== undefined) b.title = String(b.title).trim();
  if (b.description !== undefined) b.description = String(b.description).trim();
  if (b.goals !== undefined) b.goals = normalizeGoals(b.goals);
  // status allowed by your schema: planning | active | on_hold | completed | cancelled
  return b;
}

/**
 * GET /api/projects
 * Role-based listing:
 * - admin: all projects
 * - research_lead: projects they lead OR are a member of
 * - team_member: projects where they're a member
 */
router.get('/', protect, async (req, res) => {
  try {
    let query;
    if (req.user.role === 'admin') {
      query = Project.find({});
    } else if (req.user.role === 'research_lead') {
      query = Project.find({
        $or: [{ researchLead: req.user._id }, { teamMembers: req.user._id }]
      });
    } else {
      query = Project.find({ teamMembers: req.user._id });
    }

    const projects = await query
      .populate('researchLead', 'name email department role')
      .populate('teamMembers', 'name email department role')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('GET /projects error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/projects/:id
 * Access if: admin OR lead OR team member of this project
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    const project = await Project.findById(id)
      .populate('researchLead', 'name email department role')
      .populate('teamMembers', 'name email department role');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isLead = project.researchLead?.toString() === req.user._id.toString();
    const isMember = Array.isArray(project.teamMembers)
      ? project.teamMembers.some(m => m._id?.toString() === req.user._id.toString() || m.toString() === req.user._id.toString())
      : false;

    if (!isAdmin && !isLead && !isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this project' });
    }

    return res.json({ success: true, data: project });
  } catch (error) {
    console.error('GET /projects/:id error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/projects
 * Create new project (research_lead, admin)
 * body: { title, description, goals?, deadline?, status? }
 */
router.post('/', protect, authorize('research_lead', 'admin'), async (req, res) => {
  try {
    const body = cleanBody(req.body);

    if (!body.title || !body.description) {
      return res.status(400).json({ success: false, message: 'title and description are required' });
    }

    const project = await Project.create({
      title: body.title,
      description: body.description,
      goals: body.goals || [],
      deadline: body.deadline || undefined,
      status: body.status || 'planning', // planning | active | on_hold | completed | cancelled
      researchLead: req.user._id,
      teamMembers: []
    });

    const populated = await Project.findById(project._id)
      .populate('researchLead', 'name email department role')
      .populate('teamMembers', 'name email department role');

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('POST /projects error:', error);
    return res.status(400).json({ success: false, message: error.message || 'Failed to create project' });
  }
});

/**
 * PUT /api/projects/:id
 * Update project (lead or admin)
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    let project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isLead = project.researchLead?.toString() === req.user._id.toString();
    if (!isAdmin && !isLead) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }

    const updates = cleanBody(req.body);
    // Only allow certain fields to be updated
    const allowed = {};
    if (updates.title !== undefined) allowed.title = updates.title;
    if (updates.description !== undefined) allowed.description = updates.description;
    if (updates.goals !== undefined) allowed.goals = updates.goals;
    if (updates.deadline !== undefined) allowed.deadline = updates.deadline || undefined;
    if (updates.status !== undefined) allowed.status = updates.status; // must be one of enum

    project = await Project.findByIdAndUpdate(id, allowed, { new: true, runValidators: true })
      .populate('researchLead', 'name email department role')
      .populate('teamMembers', 'name email department role');

    return res.json({ success: true, data: project });
  } catch (error) {
    console.error('PUT /projects/:id error:', error);
    return res.status(400).json({ success: false, message: error.message || 'Failed to update project' });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete project (lead or admin)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isLead = project.researchLead?.toString() === req.user._id.toString();
    if (!isAdmin && !isLead) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();
    return res.json({ success: true, data: {} });
  } catch (error) {
    console.error('DELETE /projects/:id error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /api/projects/:id/team
 * Add a team member (lead or admin)
 * body: { userId }
 */
router.post('/:id/team', protect, async (req, res) => {
  try {
    const { id } = req.params;
    let { userId } = req.body;

    if (!isValidId(id) || !isValidId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid id(s)' });
    }

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const isAdmin = req.user.role === 'admin';
    const isLead = project.researchLead?.toString() === req.user._id.toString();
    if (!isAdmin && !isLead) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify team' });
    }

    const user = await User.findById(userId).select('_id name email role department');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (project.teamMembers.some(m => m.toString() === userId)) {
      return res.status(400).json({ success: false, message: 'User already in team' });
    }

    project.teamMembers.push(userId);
    await project.save();

    const populated = await Project.findById(id)
      .populate('researchLead', 'name email department role')
      .populate('teamMembers', 'name email department role');

    return res.json({ success: true, data: populated });
  } catch (error) {
    console.error('POST /projects/:id/team error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * DELETE /api/projects/:id/team/:userId
 * Remove a team member (lead or admin)
 */
router.delete('/:id/team/:userId', protect, async (req, res) => {
  try {
    const { id, userId } = req.params;
    if (!isValidId(id) || !isValidId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid id(s)' });
    }

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const isAdmin = req.user.role === 'admin';
    const isLead = project.researchLead?.toString() === req.user._id.toString();
    if (!isAdmin && !isLead) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify team' });
    }

    project.teamMembers = (project.teamMembers || []).filter(m => m.toString() !== userId);
    await project.save();

    const populated = await Project.findById(id)
      .populate('researchLead', 'name email department role')
      .populate('teamMembers', 'name email department role');

    return res.json({ success: true, data: populated });
  } catch (error) {
    console.error('DELETE /projects/:id/team/:userId error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;