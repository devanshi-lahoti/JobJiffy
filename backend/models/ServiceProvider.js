const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const serviceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
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
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  experience: {
    type: String,
    default: '0 years'
  },
  image: {
    type: String,
    default: 'default-profile.png'
  }
}, { timestamps: true });

// Hash password before saving
serviceProviderSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
serviceProviderSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

module.exports = ServiceProvider; 