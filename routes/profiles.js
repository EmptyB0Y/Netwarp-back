var express = require('express');
var router = express.Router();

const profileCtrl = require('../controllers/profile');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/', auth, upload, profileCtrl.postProfile);
router.get('/', auth, profileCtrl.getAllProfiles);
router.get('/:id', auth, profileCtrl.getProfile);
router.put('/:id', auth, upload, profileCtrl.editProfile);
router.delete('/:id', auth, profileCtrl.deleteProfile);

module.exports = router;