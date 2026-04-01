const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Public endpoint for tracking
router.post('/track', analyticsController.track);

// Protected endpoints (for dashboard)
router.get('/overview', auth, adminOnly, analyticsController.getOverview);

module.exports = router;