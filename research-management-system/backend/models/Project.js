const mongoose = require('mongoose');

// Subschema for goals (no _id needed for each goal)
const goalSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    isCompleted: { type: Boolean, default: false },
    deadline: { type: Date }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a project title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    researchLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    teamMembers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [] // always an array (prevents undefined)
    },
    goals: {
      type: [goalSchema],
      default: [] // always an array (prevents undefined)
    },
    status: {
      type: String,
      enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'],
      default: 'planning'
    },
    deadline: { type: Date },
    budget: { type: Number, default: 0 },
    tags: { type: [String], default: [] }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },   // include virtuals in JSON responses
    toObject: { virtuals: true }  // include virtuals when converting to objects
  }
);

// Safe virtual: won't crash if goals is missing/null
projectSchema.virtual('progress').get(function () {
  const goals = Array.isArray(this.goals) ? this.goals : [];
  if (goals.length === 0) return 0;
  const completed = goals.filter(g => g && g.isCompleted).length;
  return Math.round((completed / goals.length) * 100);
});

module.exports = mongoose.model('Project', projectSchema);