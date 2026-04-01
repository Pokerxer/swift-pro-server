const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Public endpoints (for tracking)
router.post('/track/view', analyticsController.recordView);
router.post('/track/click', analyticsController.recordClick);
router.post('/track/session', analyticsController.recordSession);

// Protected endpoints (for dashboard)
router.get('/overview', auth, adminOnly, analyticsController.getOverview);
router.get('/history', auth, adminOnly, analyticsController.getHistory);
router.get('/today', auth, adminOnly, analyticsController.getToday);

// Seed data (for development)
router.post('/seed', auth, adminOnly, analyticsController.seedData);

module.exports = router;