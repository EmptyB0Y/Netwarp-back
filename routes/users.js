var express = require('express');
var router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const testEmail = require('../middlewares/testEmail');
const testPassword = require('../middlewares/testPasswordStrength');

router.post('/auth/signup', testEmail, testPassword, userCtrl.register);
router.post('/auth/login', userCtrl.login);
router.get('/users', auth, userCtrl.getAllUsers);
router.get('/users/:id', auth, userCtrl.getOneUser);
router.put('/users/change-email/:id', auth,testEmail, userCtrl.editUserEmail);
router.put('/users/change-password/:id', auth,testPassword, userCtrl.editUserPassword);
router.delete('/users/:id', auth, userCtrl.deleteUser);

module.exports = router;
