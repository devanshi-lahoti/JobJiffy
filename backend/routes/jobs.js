const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');

// Public routes (no auth required)
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes (auth required)
router.post('/', auth, createJob);
router.put('/:id', auth, updateJob);
router.delete('/:id', auth, deleteJob);

module.exports = router;
