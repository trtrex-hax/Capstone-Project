const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects (role-specific)
// @access  Private
exports.getAllProjects = async (req, res, next) => {
  try {
    let query;
    const { role, _id: userId } = req.user;

    // Admins see all projects
    if (role === 'admin') {
      query = Project.find({});
    } 
    // Research Leads see their own projects + projects they're members of
    else if (role === 'research_lead') {
      query = Project.find({ 
        $or: [
          { researchLead: userId },
          { teamMembers: userId }
        ]
      });
    } 
    // Team Members see only projects they're assigned to
    else {
      query = Project.find({ teamMembers: userId });
    }

    const projects = await query
      .populate('researchLead', 'name email')
      .populate('teamMembers', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single project
// @access  Private (must be project lead, member, or admin)
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('researchLead', 'name email department')
      .populate('teamMembers', 'name email department');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Authorization check
    const { role, _id: userId } = req.user;
    const isLead = project.researchLead._id.toString() === userId.toString();
    const isMember = project.teamMembers.some(member => member._id.toString() === userId.toString());

    if (role !== 'admin' && !isLead && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create project (Research Lead or Admin only)
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    // Attach the research lead (even if admin creates it)
    req.body.researchLead = req.user._id;

    const project = await Project.create(req.body);
    const populatedProject = await Project.findById(project._id)
      .populate('researchLead', 'name email')
      .populate('teamMembers', 'name email');

    res.status(201).json({
      success: true,
      data: populatedProject
    });
  } catch (err) {
    // Handle duplicate project titles
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Project with this title already exists'
      });
    }
    next(err);
  }
};

// @desc    Update project (Lead or Admin only)
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Authorization check
    const isLead = project.researchLead.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isLead) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('researchLead', 'name email')
      .populate('teamMembers', 'name email');

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project (Lead or Admin only)
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Authorization check
    const isLead = project.researchLead.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isLead) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await project.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add team member to project (Lead or Admin only)
// @access  Private
exports.addTeamMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Authorization check
    const isLead = project.researchLead.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isLead) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this project'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already a member
    if (project.teamMembers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a team member'
      });
    }

    project.teamMembers.push(userId);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('researchLead', 'name email')
      .populate('teamMembers', 'name email department');

    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (err) {
    next(err);
  }
};