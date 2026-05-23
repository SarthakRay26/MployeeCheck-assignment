const mongoose = require('mongoose');
const { VERIFICATION_STATUSES, VERIFICATION_TYPES, ACCESS_LEVELS } = require('../config/constants');

const recordSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
    },
    verificationType: {
      type: String,
      enum: VERIFICATION_TYPES,
      required: [true, 'Verification type is required'],
    },
    status: {
      type: String,
      enum: VERIFICATION_STATUSES,
      default: 'Pending',
    },
    submittedDate: {
      type: Date,
      default: Date.now,
    },
    accessLevel: {
      type: String,
      enum: ACCESS_LEVELS,
      default: 'Level 1',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for efficient querying
recordSchema.index({ status: 1 });
recordSchema.index({ company: 1 });
recordSchema.index({ employeeName: 'text', company: 'text' });

module.exports = mongoose.model('Record', recordSchema);
