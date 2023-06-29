const { Sequelize,sequelize, Mission, Post, Profile, Photo } = require('../models');
const fs = require('fs');

// create a mission
exports.createMission = async (req, res) => {
    try{
      let post = await Post.findOne({where:{id : req.body.postId}});
      if(!post) {
        return res.status(404).json("Post non trouvée");
      }
      
      let profile = await Profile.findOne({where:{id : post.ProfileId}});
      if(profile.UserId !== res.locals.userId && !res.locals.isAdmin) {
        return res.status(403).json("Vous n'êtes pas autorisé à accéder à cette post");
      }

      let missionCreated = {
        PostId: req.body.postId,
        description: req.body.description,
        dateDebut: req.body.dateDebut,
        dateFin: req.body.dateFin,
        accomplie: false
      };
      let mission = await Mission.create(missionCreated);
      await Post.update({MissionId : mission.id},{where: {id: req.body.postId}});
      res.status(201).json(mission);
    } catch(err){
      res.status(500).json({ error : err });
    }
};

// get all missions
exports.getAllMissions = async (req, res) => {
  try {

    if(req.param("view") == null){
      res.status(404).json({ message : 'Le paramètre view est obligatoire'}); 
    }
    
    if(req.param("view") == "admin"){
      if(!res.locals.isAdmin){
        res.status(403).json({ message: 'Vous ne pouvez pas accéder à la vue admin mission' });
      }
      
      else{
        let missions = await Mission.findAll();
        res.status(200).json(missions)
      }
    }
    else if(req.param("view") == "caretaker") {
      let profile = await Profile.findOne({where: {UserId: res.locals.userId}});
      let missions = await Mission.findAll({where: {ProfileId: profile.id}});
      res.status(200).json(missions);
    }
    else if(req.param("view") == "owner"){
      let profile = await Profile.findOne({where: {UserId: res.locals.userId}});
      let posts = await Post.findAll({where: {ProfileId: profile.id}});
      let missions = [];
      
      await Promise.all(posts.map(async (post) => {
        let postMissions = await Mission.findAll({ where: { PostId: post.id }, include: ['Profile'] });
        missions.push(...postMissions);
      }));
      res.status(200).json(missions);

    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// get a mission by ID
exports.getMissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const mission = await Mission.findByPk(id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    let post = await Post.findByPk(mission.PostId);
    let profileMission = await Profile.findByPk(mission.ProfileId);
    let profilePost = await Profile.findByPk(post.ProfileId);
    if(profilePost.UserId !== res.locals.userId && !res.locals.isAdmin && profileMission.UserId !== res.locals.userId){
      res.status(403).json({ message: 'Vous ne pouvez pas accéder à cette mission' });
    }
    res.json(mission);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// update a mission
exports.editMission = async (req, res) => {
  const { id } = req.params;
  try {

    let post = await Post.findOne({where:{id : req.body.postId}});
    
    if(!post) {
      return res.status(404).json("Post non trouvée");
    }

    const mission = await Mission.findByPk(id);
    if (!mission) {
      res.status(404).json({ message: 'Mission non trouvée' });
      return;
    }
    let missionUpdated = {
      ProfileId: req.body.profileId,
      PostId: req.body.postId,
      description: req.body.description,
      dateDebut: req.body.dateDebut,
      dateFin: req.body.dateFin,
      accomplie: req.body.accomplie
    };
    if(missionUpdated.ProfileId == post.ProfileId){
      res.status(403).json({ message: 'Mission et Post le peuvent pas avoir le même ProfileId' });
    }
    await mission.update({...missionUpdated },{where:{id : id}});
    if(missionUpdated.PostId !== mission.PostId){
      await Post.update({MissionId : mission.id},{where: {id: req.body.postId}});
    }


    res.json(mission);
  } catch (err) {
    console.error(error);
    res.status(500).json({ error : err });
  }
};

// delete a mission
exports.deleteMission = async (req, res) => {
  const { id } = req.params;
  try {
    let mission = await Mission.findByPk(id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }
    let post = await Post.findByPk(mission.PostId);
    let profile = await Profile.findByPk(post.ProfileId);
    if(profile.UserId !== res.locals.userId && !res.locals.isAdmin){
      res.status(403).json({ message: 'Vous ne pouvez pas accéder à cette mission' });
    }
    await mission.destroy();
    res.status(204).json();
  } catch (error) {
    console.error(err);
    res.status(500).json({ error : err });
  }
};

exports.uploadPhoto = async (req, res) => {
  const { id } = req.params;
  try {
    let mission = await Mission.findByPk(id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }
    if(!req.file){
      return res.status(400).json({ message: 'Fichier manquant' });
    }

    let post = await Post.findByPk(mission.PostId);
    let profile = await Profile.findByPk(post.ProfileId);
    if(profile.UserId !== res.locals.userId && !res.locals.isAdmin){
      res.status(403).json({ message: 'Vous ne pouvez pas accéder à cette mission' });
    }

    let photo = await Photo.create({
      MissionId: mission.id,
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
    let mission = await Mission.findByPk(photo.MissionId);

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }
    let post = await Post.findByPk(mission.PostId);
    let profile = await Profile.findByPk(post.ProfileId);
    if(profile.UserId !== res.locals.userId && !res.locals.isAdmin){
      res.status(403).json({ message: 'Vous ne pouvez pas accéder à cette mission' });
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