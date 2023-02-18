var express = require('express');
var router = express.Router();

const profileCtrl = require('../controllers/profile');
const auth = require('../middlewares/auth');

router.post('/', auth, profileCtrl.postProfile);
router.get('/', auth, profileCtrl.getAllProfiles);
router.get('/:id', auth, profileCtrl.getProfile);
router.delete('/:id', auth, profileCtrl.deleteProfile);

module.exports = router;