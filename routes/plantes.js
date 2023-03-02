var express = require('express');
var router = express.Router();

const planteCtrl = require('../controllers/plante');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', auth, planteCtrl.findAll);
router.get('/:id', auth, planteCtrl.findOne);
router.post('/', auth, upload, planteCtrl.postPlante);
router.put('/:id', auth, upload, planteCtrl.editPlante);


module.exports = router;