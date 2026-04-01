const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// All user management requires auth + admin role
router.use(auth, adminOnly);

router.get('/', usersController.getAll);
router.post('/', usersController.create);
router.patch('/:id', usersController.update);
router.patch('/:id/role', usersController.updateRole);
router.delete('/:id', usersController.delete);

module.exports = router;
