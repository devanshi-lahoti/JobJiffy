const ServiceProvider = require('../models/ServiceProvider');
const jwt = require('jsonwebtoken');

// Service Provider Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, serviceType, location, pricing, jobDescription } = req.body;

    // Check if service provider already exists
    const existingProvider = await ServiceProvider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ 
        success: false,
        message: 'Service provider already exists with this email' 
      });
    }

    // Create new service provider
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
      serviceProvider: {
        id: serviceProvider._id,
        name: serviceProvider.name,
        email: serviceProvider.email,
        serviceType: serviceProvider.serviceType,
        location: serviceProvider.location,
        pricing: serviceProvider.pricing,
        jobDescription: serviceProvider.jobDescription
      }
    });
  } catch (error) {
    console.error('Service provider signup error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error registering service provider', 
      error: error.message 
    });
  }
};

// Service Provider Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if service provider exists
    const serviceProvider = await ServiceProvider.findOne({ email });
    if (!serviceProvider) {
      return res.status(401).json({
        success: false,
        message: 'Service provider does not exist. Please sign up first.'
      });
    }

    // Check password
    const isMatch = await serviceProvider.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Generate JWT token only at login
    const token = jwt.sign(
      { 
        providerId: serviceProvider._id,
        role: 'service_provider'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token, // Include token in login response
      serviceProvider: {
        id: serviceProvider._id,
        name: serviceProvider.name,
        email: serviceProvider.email,
        serviceType: serviceProvider.serviceType,
        location: serviceProvider.location,
        pricing: serviceProvider.pricing,
        jobDescription: serviceProvider.jobDescription,
        status: serviceProvider.status
      }
    });
  } catch (error) {
    console.error('Service provider login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
}; 