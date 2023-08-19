var express = require('express');
var router = express.Router();

const commentCtrl = require('../controllers/comment');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

//router.get('/', auth, missionCtrl.getAllComments);    
router.get('/:id/comments', commentCtrl.getCommentsByComment);
router.get('/:id', commentCtrl.getCommentById);
router.post('/', auth, commentCtrl.createComment);
// router.put('/:id', auth, missionCtrl.editComment);
router.post('/:id/upvote', auth, commentCtrl.upvoteComment);
router.delete('/:id', auth, commentCtrl.deleteComment);

router.get('/:id/photos', commentCtrl.getPhotos);
router.post('/:id/upload-photo', auth, upload, commentCtrl.uploadPhoto);
router.delete('/delete-photo/:id', auth, commentCtrl.deletePhoto);

module.exports = router;