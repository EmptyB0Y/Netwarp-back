const { Sequelize,sequelize, Mission, Plante, Profile } = require('../models');

// create a mission
exports.createMission = async (req, res) => {
    try{
      let plante = await Plante.findOne({where:{id : req.body.planteId}});
      if(!plante) {
        return res.status(404).json("Plante non trouvée");
      }
      
      let profile = await Profile.findOne({where:{id : plante.ProfileId}});
      if(profile.userUid !== res.locals.userId && !res.locals.isAdmin) {
        return res.status(403).json("Vous n'êtes pas autorisé à accéder à cette plante");
      }

      let missionCreated = {
        PlanteId: req.body.planteId,
        description: req.body.description,
        dateDebut: req.body.dateDebut,
        dateFin: req.body.dateFin,
        accomplie: false
      };
      let mission = await Mission.create(missionCreated);
      res.status(201).json(mission);
    } catch(err){
      res.status(500).json({ error : err });
    }
};

// get all missions
exports.getAllMissions = async (req, res) => {
  try {
    if(req.params.get("view") == "admin"){
      if(!res.locals.isAdmin){
        res.status(403).json({ message: 'Vous ne pouvez pas accéder à la vue admin mission' });
      }
      else{
        let missions = await Mission.findAll();
        res.json(missions)
      }
    }
    else if(req.params.get("view") == "caretaker") {
      let profile = await Profile.findOne({where: {userUid: res.locals.userId}});
      let missions = await Mission.findAll({where: {ProfileId: profile.id}});
      res.json(missions);
    }
    else if(req.params.get("view") == "owner"){
      let profile = await Profile.findOne({where: {userUid: res.locals.userId}});
      let plantes = await Plante.findAll({where: {ProfileId: profile.id}});
      let missions = [];
      plantes.forEach(plante => {
        Mission.findAll({where: {PlanteId: plante.id}}).then(mission => {
          missions.push(mission);
        })
      });
      res.json(missions);
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

    let plante = await Plante.findByPk(mission.PlanteId);
    let profileMission = await Profile.findByPk(mission.ProfileId);
    let profilePlante = await Profile.findByPk(plante.ProfileId);
    if(profilePlante.userUid !== res.locals.userId && !res.locals.isAdmin && profileMission.userUid !== res.locals.userId){
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

    let plante = await Plante.findOne({where:{id : req.body.planteId}});
    
    if(!plante) {
      return res.status(404).json("Plante non trouvée");
    }

    const mission = await Mission.findByPk(id);
    if (!mission) {
      res.status(404).json({ message: 'Mission non trouvée' });
      return;
    }
    let missionUpdated = {
      ProfileId: req.body.profileId,
      PlanteId: req.body.planteId,
      description: req.body.description,
      dateDebut: req.body.dateDebut,
      dateFin: req.body.dateFin,
      accomplie: req.body.accomplie
    };
    if(missionUpdated.ProfileId == plante.ProfileId){
      res.status(403).json({ message: 'Mission et Plante le peuvent pas avoir le même ProfileId' });
    }
    await mission.update({...missionUpdated },{where:{id : id}});


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
    let plante = await Plante.findByPk(mission.PlanteId);
    let profile = await Profile.findByPk(plante.ProfileId);
    if(profile.userUid !== res.locals.userId && !res.locals.isAdmin){
      res.status(403).json({ message: 'Vous ne pouvez pas accéder à cette mission' });
    }
    await mission.destroy();
    res.status(204).json();
  } catch (error) {
    console.error(err);
    res.status(500).json({ error : err });
  }
};