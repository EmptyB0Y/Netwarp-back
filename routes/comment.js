var express = require('express');
var router = express.Router();

const commentCtrl = require('../controllers/comment');
const auth = require('../middlewares/auth');

//router.get('/', auth, missionCtrl.getAllComments);    
router.get('/:id/comments', commentCtrl.getCommentsByComment)
router.get('/:id', commentCtrl.getCommentById);
router.post('/', auth, commentCtrl.createComment);
// router.put('/:id', auth, missionCtrl.editComment);
router.put('/:id/upvote', auth, commentCtrl.upvoteComment);
router.delete('/:id', auth, commentCtrl.deleteComment);

module.exports = router;