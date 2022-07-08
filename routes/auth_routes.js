const { Router } = require('express');
const router = Router();
const auth_controllers = require('../controllers/auth_controllers');

router.get('/signup', auth_controllers.signup_get);
router.get('/login', auth_controllers.login_get);
router.post('/signup', auth_controllers.signup_post);
router.post('/login', auth_controllers.login_post);

module.exports = router;