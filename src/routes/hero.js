const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const auth = require('../middleware/auth');

router.get('/', heroController.get);
router.put('/', auth, heroController.update);

module.exports = router;