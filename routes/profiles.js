var express = require('express');
var router = express.Router();

const profileCtrl = require('../controllers/profile');
const notificationCtrl = require('../controllers/notification');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/search', profileCtrl.textSearchProfile);
router.post('/', auth, upload, profileCtrl.postProfile);
router.get('/', profileCtrl.getAllProfiles);
router.get('/:id', profileCtrl.getProfile);
router.get('/:id/notifications', auth, notificationCtrl.getNotificationsByProfile)
router.put('/:id', auth, upload, profileCtrl.editProfile);
router.delete('/:id', auth, profileCtrl.deleteProfile);
router.delete('/notifications/:id',auth , notificationCtrl.deleteNotification);

module.exports = router;