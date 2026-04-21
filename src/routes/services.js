const express = require('express');
const router = express.Router();
const controller = require('../controllers/serviceController');
const auth = require('../middleware/auth');

router.get('/', controller.getAll);
router.get('/slug/:slug', controller.getBySlug);   // must be before /:id
router.get('/:id', controller.getOne);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
