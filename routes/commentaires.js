var express = require('express');
var router = express.Router();

const commentaireCtrl = require('../controllers/commentaire');
const auth = require('../middlewares/auth');

//router.get('/', auth, missionCtrl.getAllCommentaires);
router.get('/:id', auth, commentaireCtrl.getCommentaireById);
router.post('/', auth, commentaireCtrl.createCommentaire);
// router.put('/:id', auth, missionCtrl.editCommentaire);
router.delete('/:id', auth, commentaireCtrl.deleteCommentaire);

module.exports = router;