const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const serviceProviderController = require('../controllers/serviceProviderController');

// Service Provider routes (no JWT middleware)
router.post('/provider/signup', serviceProviderController.signup);
router.post('/provider/login', serviceProviderController.login);

// User routes
router.post('/user/signup', authController.signup);
router.post('/user/login', authController.login);

module.exports = router;
