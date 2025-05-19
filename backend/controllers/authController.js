const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Job = require('../models/Job');
const ServiceProvider = require('../models/ServiceProvider');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User does not exist. Please sign up first.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // If service provider, get their job profile
    let jobProfile = null;
    if (user.role === 'service_provider') {
      jobProfile = await Job.findOne({ userId: user._id });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.role === 'service_provider' && jobProfile && {
          serviceType: jobProfile.serviceType,
          location: jobProfile.location,
          pricing: jobProfile.pricing,
          jobDescription: jobProfile.jobDescription
        })
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Signup controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, serviceType, location, pricing, jobDescription } = req.body;

    // Check if email exists in either User or ServiceProvider
    const existingUser = await User.findOne({ email });
    const existingProvider = await ServiceProvider.findOne({ email });

    if (existingUser || existingProvider) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    if (role === 'service_provider') {
      // Create service provider
      const serviceProvider = new ServiceProvider({
        name,
        email,
        password,
        serviceType,
        location,
        pricing,
        jobDescription
      });

      await serviceProvider.save();

      res.status(201).json({
        success: true,
        message: 'Service provider registered successfully',
        user: {
          id: serviceProvider._id,
          name: serviceProvider.name,
          email: serviceProvider.email,
          role: 'service_provider',
          serviceType: serviceProvider.serviceType,
          location: serviceProvider.location,
          pricing: serviceProvider.pricing,
          jobDescription: serviceProvider.jobDescription
        }
      });
    } else {
      // Create regular user
      const user = new User({
        name,
        email,
        password,
        role: 'user'
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'user'
        }
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating user', 
      error: error.message 
    });
  }
};
