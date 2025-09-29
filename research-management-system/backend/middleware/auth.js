// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is marked as demo, trust claims and DO NOT fetch from DB
    if (decoded.demo === true) {
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        department: decoded.department
      };
      return next();
    }

    // Otherwise, try DB (only if a valid ObjectId)
    let user = null;
    if (decoded.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
      user = await User.findById(decoded.id).select('-password');
    }
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found for token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `User role ${req.user?.role} is not authorized to access this route`
    });
  }
  next();
};