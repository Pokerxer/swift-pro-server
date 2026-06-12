const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');

router.get('/', settingsController.get);
router.put('/', auth, settingsController.update);

module.exports = router;
