const express = require('express');
const mongoose = require('mongoose');
const { protect } = require('../middleware/auth');
const Project = require('../models/Project');
const Comment = require('../models/Comment');

const router = express.Router();
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

async function canAccessProject(projectId, userId, userRole) {
  if (!isValidId(projectId)) return { ok: false, status: 400, message: 'Invalid project id' };
  const project = await Project.findById(projectId).select('researchLead teamMembers');
  if (!project) return { ok: false, status: 404, message: 'Project not found' };

  const isAdmin = userRole === 'admin';
  const isLead = project.researchLead?.toString() === userId.toString();
  const isMember = Array.isArray(project.teamMembers) && project.teamMembers.some(m => m.toString() === userId.toString());
  if (!isAdmin && !isLead && !isMember) {
    return { ok: false, status: 403, message: 'Not authorized for this project' };
  }
  return { ok: true, project };
}

// GET: list comments for a project (with pagination)
router.get('/projects/:projectId/comments', protect, async (req, res) => {
  try {
    const { projectId } = req.params;
    const access = await canAccessProject(projectId, req.user._id, req.user.role);
    if (!access.ok) return res.status(access.status).json({ success: false, message: access.message });

    const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ project: projectId })
        .populate('author', 'name email role department')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comment.countDocuments({ project: projectId })
    ]);

    res.json({
      success: true,
      data: comments,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('GET /projects/:projectId/comments error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST: add a new comment to a project
router.post('/projects/:projectId/comments', protect, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content, attachments } = req.body || {};

    const access = await canAccessProject(projectId, req.user._id, req.user.role);
    if (!access.ok) return res.status(access.status).json({ success: false, message: access.message });

    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const comment = await Comment.create({
      project: projectId,
      author: req.user._id,
      content: content.trim(),
      attachments: Array.isArray(attachments) ? attachments : []
    });

    const populated = await Comment.findById(comment._id)
      .populate('author', 'name email role department');

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error('POST /projects/:projectId/comments error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE: delete a comment (author, lead, or admin)
router.delete('/comments/:commentId', protect, async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!isValidId(commentId)) {
      return res.status(400).json({ success: false, message: 'Invalid comment id' });
    }

    const comment = await Comment.findById(commentId).populate({
      path: 'project',
      select: 'researchLead teamMembers'
    });

    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    const isAdmin = req.user.role === 'admin';
    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isLead = comment.project?.researchLead?.toString() === req.user._id.toString();

    if (!isAdmin && !isAuthor && !isLead) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ success: true, data: {} });
  } catch (err) {
    console.error('DELETE /comments/:commentId error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;