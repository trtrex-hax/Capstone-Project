const mongoose = require('mongoose');

const systemHealthSchema = new mongoose.Schema({
  metric: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SystemHealth', systemHealthSchema);