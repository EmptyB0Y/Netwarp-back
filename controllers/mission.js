const { Sequelize,sequelize, Mission, Plante, Profile } = require('../models');

// create a mission
exports.createMission = async (req, res) => {
    
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
    Mission.create(missionCreated).then(mission => {
      res.status(201).json(mission);

    }).catch(err => {
      res.status(500).json({ message: 'Server error' });
    });
};

// get all missions
exports.getAllMissions = async (req, res) => {
  try {
    const missions = await Mission.findAll();
    res.json(missions);
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
      res.status(404).json({ message: 'Mission not found' });
      return;
    }
    res.json(mission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// update a mission
exports.editMission = async (req, res) => {
  const { id } = req.params;
  try {
    const mission = await Mission.findByPk(id);
    if (!mission) {
      res.status(404).json({ message: 'Mission not found' });
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
    await mission.update({...missionUpdated },{where:{id : id}});


    res.json(mission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// delete a mission
exports.deleteMission = async (req, res) => {
  const { id } = req.params;
  try {
    const mission = await Mission.findByPk(id);
    if (!mission) {
      res.status(404).json({ message: 'Mission not found' });
      return;
    }
    await mission.destroy();
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};