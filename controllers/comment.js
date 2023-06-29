const { Comment, Profile, Post, Mission } = require('../models');

exports.createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;

    let profile = await Profile.findOne({where:{UserId: res.locals.userId}});
    let post = await Post.findByPk(postId);
    let profilePost = await Profile.findByPk(post.ProfileId);
    let mission = await Mission.findByPk(post.MissionId);
    let profileMission = await Profile.findByPk(mission.ProfileId);

    if(profile == null || (profilePost == null && profileMission == null)) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à poster ce comment" });
    }

    if(profileMission != null){
      if(profileMission.UserId != res.locals.userId) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à poster ce comment" });
      }
    }else if(profilePost!= null){
      if(profilePost.UserId != res.locals.userId) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à poster ce comment" });
      }
    }

    console.log({
      ProfileId: profile.id,
      PostId: postId,
      content: content
    });
    
    // Create the new comment
    const comment = await Comment.create({
      ProfileId: profile.id,
      PostId: postId,
      content: content
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);
    let post = await Post.findByPk(comment.PostId);
    let profilePost = await Profile.findByPk(post.ProfileId);
    let profile = await Profile.findByPk(comment.ProfileId);

    if(profilePost.UserId != res.locals.userId && profile.UserId != res.locals.userId && !res.locals.isAdmin) {
      return res.status(403).json({ message: "Vous ne pouvez pas acceder à ce comment" });
    }
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
      return res.status(403).json({ message: "Vous ne pouvez pas acceder à ce comment" });
    }
    if (!comment) {
      return res.status(404).json({ message: 'Comment non trouvé' });
    }

    // Update the comment
    comment.content = content;
    await comment.save();

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

    if(profile.userId != res.locals.userId && !res.locals.isAdmin) {
      return res.status(403).json({ message: "Vous ne pouvez pas acceder à ce comment" });
    }
    const deletedComment = await Comment.destroy({ where: { id } });

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment non trouvé' });
    }

    res.json({ message: 'Comment supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};