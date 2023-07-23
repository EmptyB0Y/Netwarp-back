var express = require('express');
var router = express.Router();

const commentCtrl = require('../controllers/comment');
const auth = require('../middlewares/auth');

//router.get('/', auth, missionCtrl.getAllComments);    
router.get('/:id/comments', commentCtrl.getCommentsByComment)
router.get('/:id', auth, commentCtrl.getCommentById);
router.post('/', auth, commentCtrl.createComment);
// router.put('/:id', auth, missionCtrl.editComment);
router.delete('/:id', auth, commentCtrl.deleteComment);

module.exports = router;