const { Mission } = require('../models');

// create a mission
exports.createMission = async (req, res) => {
  try {
    const mission = await Mission.create(req.body);
    res.status(201).json(mission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
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
exports.updateMission = async (req, res) => {
  const { id } = req.params;
  try {
    const mission = await Mission.findByPk(id);
    if (!mission) {
      res.status(404).json({ message: 'Mission not found' });
      return;
    }
    await mission.update(req.body);
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