var express = require('express');
var router = express.Router();

const missionCtrl = require('../controllers/mission');
const auth = require('../middlewares/auth');

router.post('/', auth, missionCtrl.createMission);
router.put('/:id', auth, missionCtrl.editMission);


module.exports = router;