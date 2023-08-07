var express = require('express');
var router = express.Router();

const commentCtrl = require('../controllers/comment');
const postCtrl = require('../controllers/post');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/:id/comments', commentCtrl.getCommentsByPost)
router.get('/:id', postCtrl.findPost);
router.get('/topic/:topic', postCtrl.findAllPostsByTopic);
router.get('/profile/:id', postCtrl.findAllPostsByProfile);
router.post('/', auth, postCtrl.createPost);
router.put('/:id', auth, postCtrl.editPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.post('/:id/upload-photo', auth, upload, postCtrl.uploadPhoto);
router.delete('/delete-photo/:id', auth, postCtrl.deletePhoto);

module.exports = router;