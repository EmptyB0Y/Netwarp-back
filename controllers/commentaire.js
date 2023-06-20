const { Commentaire, Profile, Post, Mission } = require('../models');

exports.createCommentaire = async (req, res) => {
  try {
    const { content, postId } = req.body;

    let profile = await Profile.findOne({where:{userUid: res.locals.userId}});
    let post = await Post.findByPk(postId);
    let profilePost = await Profile.findByPk(post.ProfileId);
    let mission = await Mission.findByPk(post.MissionId);
    let profileMission = await Profile.findByPk(mission.ProfileId);

    if(profile == null || (profilePost == null && profileMission == null)) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à poster ce commentaire" });
    }

    if(profileMission != null){
      if(profileMission.userUid != res.locals.userId) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à poster ce commentaire" });
      }
    }else if(profilePost!= null){
      if(profilePost.userUid != res.locals.userId) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à poster ce commentaire" });
      }
    }

    console.log({
      ProfileId: profile.id,
      PostId: postId,
      content: content
    });
    
    // Create the new commentaire
    const commentaire = await Commentaire.create({
      ProfileId: profile.id,
      PostId: postId,
      content: content
    });

    res.status(201).json(commentaire);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
};

exports.getCommentaireById = async (req, res) => {
  try {
    const { id } = req.params;

    const commentaire = await Commentaire.findByPk(id);
    let post = await Post.findByPk(commentaire.PostId);
    let profilePost = await Profile.findByPk(post.ProfileId);
    let profile = await Profile.findByPk(commentaire.ProfileId);

    if(profilePost.userUid != res.locals.userId && profile.userUid != res.locals.userId && !res.locals.isAdmin) {
      return res.status(403).json({ message: "Vous ne pouvez pas acceder à ce commentaire" });
    }
    if (!commentaire) {
      return res.status(404).json({ message: 'Commentaire not found' });
    }

    res.json(commentaire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCommentaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Find the existing commentaire
    const commentaire = await Commentaire.findByPk(id);
    let profile = await Profile.findByPk(commentaire.ProfileId);

    if(profile.userId != res.locals.userId && !res.locals.isAdmin) {
      return res.status(403).json({ message: "Vous ne pouvez pas acceder à ce commentaire" });
    }
    if (!commentaire) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    // Update the commentaire
    commentaire.content = content;
    await commentaire.save();

    res.json(commentaire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCommentaire = async (req, res) => {
  try {
    const { id } = req.params;
    let commentaire = await Commentaire.findByPk(id);
    let profile = await Profile.findByPk(commentaire.ProfileId);

    if(profile.userId != res.locals.userId && !res.locals.isAdmin) {
      return res.status(403).json({ message: "Vous ne pouvez pas acceder à ce commentaire" });
    }
    const deletedCommentaire = await Commentaire.destroy({ where: { id } });

    if (!deletedCommentaire) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.json({ message: 'Commentaire supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};