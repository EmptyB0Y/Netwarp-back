const { Comment, Profile, Post, Notification, Photo } = require('../models');

exports.createComment = async (req, res) => {
  try {
    const { content, postId, commentId } = req.body;

    let profile = await Profile.findOne({where:{UserId: res.locals.userId}});
    let post = await Post.findByPk(postId);
    let com = await Comment.findByPk(commentId);

    let profileCommented = null;
    let name = "comment";

    if(com){
      profileCommented = await Comment.findByPk(com.ProfileId);
    }
    else if(post){
      profileCommented = await Profile.findByPk(post.ProfileId);
      name = "post"
    }
    else{
      return res.status(404).json({ message : "Post ou commentaire non trouvé"});

    }
    
    // Create the new comment
    const comment = await Comment.create({
      ProfileId: profile.id,
      PostId: postId,
      CommentId: commentId,
      content: content,
      upvotes: "[]"
    });

    await Notification.create({
      ProfileId: profileCommented.id,
      content: profile.username + " has commented on your "+ name +".",
      target: "comment " + comment.id
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};

exports.getCommentsByPost = async (req, res) => {
  try{
    const { id } = req.params;
    const comments = await Comment.findAll({where: {PostId: id, CommentId: null}});

    res.json(comments);
  }catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error', error: error});
  }
}

exports.getCommentsByComment = async (req, res) => {
  try{
    const { id } = req.params;

    const comments = await Comment.findAll({where: {CommentId: id}});
    
    res.json(comments);
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error : error });
  }
}

exports.getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Find the existing comment
    const comment = await Comment.findByPk(id);
    let profile = await Profile.findByPk(comment.ProfileId);

    if(profile.userId != res.locals.userId && !res.locals.isAdmin) {
      return res.status(403).json({ message: "Vous ne pouvez pas acceder à ce commentaire" });
    }
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    // Update the comment
    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};

exports.upvoteComment = async (req, res) => {
  try{
    const { id } = req.params;

    const comment = await Comment.findByPk(id);
    let profile = await Profile.findByPk(comment.ProfileId);
    let profileLike = await Profile.findOne({where:{userId: res.locals.userId}});
    let upvotes = JSON.parse(comment.upvotes);
    let like = false;

    if(profileLike.id === profile.id){
      return res.status(400).json({message: "Vous ne pouvez pas upvoter votre propre commentaire"});
    }
    if(!upvotes.includes(profileLike.id)) {
      upvotes.push(profileLike.id);
      like = true;
    }
    else{
      const index = upvotes.indexOf(profileLike.id);
      if (index > -1) {
        upvotes.splice(index, 1);
      }    
    }

    comment.upvotes = JSON.stringify(upvotes);
    await comment.save();
    if(like){
      await Notification.create({
        ProfileId: profile.id,
        content: profileLike.username + " has upvoted your comment.",
        target: "profile "+ profileLike.id
      });
    }

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    let comment = await Comment.findByPk(id);
    let profile = await Profile.findByPk(comment.ProfileId);

    if(profile.UserId != res.locals.userId && !res.locals.isAdmin) {
      return res.status(403).json({ message: "Vous ne pouvez pas acceder à ce commentaire" });
    }
    const deletedComment = await Comment.destroy({ where: { id } });

    if (!deletedComment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.json({ message: 'Commentaire supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPhotos = async (req, res) => {
  
  const { id } = req.params;
  try{
    let photos = await Photo.findAll({where: {CommentId: id}});

    res.json(photos);

  } catch (error) {
    console.error(err);
    res.status(500).json({ error : err });
  }
};

exports.uploadPhoto = async (req, res) => {

  const { id } = req.params;
  try {
    let comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvée' });
    }
    if(!req.file){
      return res.status(400).json({ message: 'Fichier manquant' });
    }

    let profile = await Profile.findByPk(comment.ProfileId);
    if(profile.UserId !== res.locals.userId && !res.locals.isAdmin){
      res.status(403).json({ message: 'Vous ne pouvez pas accéder à ce commentaire' });
    }

    let photo = await Photo.create({
      CommentId: comment.id,
      url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    res.status(201).json(photo);
  } catch (error) {
    console.error(err);
    res.status(500).json({ error : err });
  }
};

exports.deletePhoto = async (req, res) => {
  const { id } = req.params;
  try {
    let photo = await Photo.findByPk(id);
    let comment = await Comment.findByPk(photo.CommentId);

    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    let profile = await Profile.findByPk(comment.ProfileId);
    if(profile.UserId !== res.locals.userId && !res.locals.isAdmin){
      res.status(403).json({ message: 'Vous ne pouvez pas accéder à ce commentaire' });
    }
    fs.unlink('./images/' + photo.url.split('/images/')[1], (err) => {
      if (err) {
        console.error(err)
      }
    })
    await photo.destroy();
    res.status(204).json();
  } catch (error) {
    console.error(err);
    res.status(500).json({ error : err });
  }
};