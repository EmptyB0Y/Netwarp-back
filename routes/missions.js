var express = require('express');
var router = express.Router();

const missionCtrl = require('../controllers/mission');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', auth, missionCtrl.getAllMissions);
router.get('/:id', auth, missionCtrl.getMissionById);
router.post('/', auth, missionCtrl.createMission);
router.put('/:id', auth, missionCtrl.editMission);
router.post('/:id/upload-photo', auth, upload, missionCtrl.uploadPhoto);
router.delete('/:id/delete-photo/:id', auth, missionCtrl.deletePhoto);

module.exports = router;