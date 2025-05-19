const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'gardening', 'other'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  pricing: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);