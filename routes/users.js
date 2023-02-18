var express = require('express');
var router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const testEmail = require('../middlewares/testEmail');
const testPassword = require('../middlewares/testPasswordStrength.js');

router.post('/auth/signup', testEmail, testPassword, userCtrl.register);
router.post('/auth/login', userCtrl.login);
router.get('/secure/users', auth, userCtrl.getAllUsers);
router.get('/secure/users/:id', auth, userCtrl.getOneUser);
router.delete('/secure/users/:id', auth, userCtrl.deleteUser);

module.exports = router;
