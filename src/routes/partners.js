const express = require('express');
const router = express.Router();
const partnersController = require('../controllers/partnerController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/active', partnersController.getActive);
router.get('/', auth, adminOnly, partnersController.getAll);
router.get('/:id', auth, adminOnly, partnersController.getOne);
router.post('/', auth, adminOnly, partnersController.create);
router.patch('/:id', auth, adminOnly, partnersController.update);
router.delete('/:id', auth, adminOnly, partnersController.remove);

module.exports = router;
