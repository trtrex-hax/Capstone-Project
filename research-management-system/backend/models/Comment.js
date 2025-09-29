const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    filename: String,
    url: String
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000
    },
    attachments: {
      type: [attachmentSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);