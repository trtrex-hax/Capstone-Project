const express = require('express');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');

const router = express.Router();

const ALLOWED_ROLES = ['admin', 'research_lead', 'team_member'];

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, message: 'Request body must be JSON' });
    }

    let { name, email, password, role, department } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'name, email, password, role are required' });
    }

    // Validate role
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role selected' });
    }

    email = String(email).toLowerCase().trim();

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user (password hashing is done in User model pre-save)
    const user = await User.create({
      name: String(name).trim(),
      email,
      password,
      role,
      department: department || ''
    });

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    email = String(email).toLowerCase().trim();

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.matchPassword(password))) {
      // Optional: record last login (ignore if fails)
      user.lastLogin = new Date();
      try { await user.save(); } catch (_) {}

      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          token: generateToken(user._id)
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;