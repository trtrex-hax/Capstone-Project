// backend/routes/users.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const authorizeLeadOrAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role === 'admin' || role === 'research_lead') return next();
  return res.status(403).json({ success: false, message: 'Forbidden: requires research_lead or admin' });
};

/**
 * GET /api/users
 * Optional query: role=team_member or research_lead etc.
 */
router.get('/', protect, authorizeLeadOrAdmin, async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(query).select('name email role department');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('GET /users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

module.exports = router;