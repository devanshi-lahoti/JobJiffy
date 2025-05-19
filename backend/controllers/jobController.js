const Job = require('../models/Job');
const ServiceProvider = require('../models/ServiceProvider');

exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: 'Error creating job' });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    console.log('Fetching all service providers...');
    
    // Add error handling for database connection
    if (!ServiceProvider) {
      console.error('ServiceProvider model is not defined');
      return res.status(500).json({
        success: false,
        message: 'Database model error'
      });
    }

    const serviceProviders = await ServiceProvider.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    console.log('Found service providers:', serviceProviders.length);

    // Transform the data to ensure consistent format
    const formattedProviders = serviceProviders.map(provider => ({
      _id: provider._id,
      name: provider.name,
      serviceType: provider.serviceType,
      location: provider.location,
      pricing: provider.pricing,
      jobDescription: provider.jobDescription,
      rating: provider.rating,
      experience: provider.experience,
      image: provider.image,
      status: provider.status
    }));

    // If no service providers found, return empty array instead of error
    if (!formattedProviders || formattedProviders.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    res.json({
      success: true,
      data: formattedProviders
    });
  } catch (error) {
    console.error('Error in getAllJobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service providers',
      error: error.message
    });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id)
      .select('-password');

    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    res.json({
      success: true,
      data: serviceProvider
    });
  } catch (error) {
    console.error('Error fetching service provider:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service provider',
      error: error.message
    });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: 'Error updating job' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting job' });
  }
};
