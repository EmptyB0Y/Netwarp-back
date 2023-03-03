const {Sequelize,sequelize, Plante, Profile, Photo} = require('../models');
const fs = require('fs');

// Create a new plant
exports.postPlante = (req, res) => {
  // Validate request
  if (!req.body.nom) {
    res.status(400).send({
      message: "Le nom ne peut pas être vide."
    });
    return;
  }

  // Create a plant object
  const plant = {
    nom: req.body.nom,
  };

  // Save plant in the database
  Profile.findOne({where: {userUid: res.locals.userId}}).then(profile => {
    if(!profile) {
      res.status(500).json({message : "Pas de profil trouvé"});
    }
    Plante.create({...plant,ProfileId: profile.id})
      .then(planteCreated => {
        //Profile.update({...profile,PlanteId:planteCreated.id}, {where: {userUid: res.locals.userId}}).then(() => {
          res.send(planteCreated);
        //});
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur est survenue lors de la création de la plante."
      });
    });
};

// Retrieve all plants from the database
exports.findAll = (req, res) => {
  Plante.findAll({ include: ['Mission', 'Profile'] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur est survenue lors de la récupération des plantes."
      });
    });
};

// Find a single plant with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Plante.findByPk(id, { include: ['Mission', 'Profile', 'Commentaire'] })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: "La plante avec l'ID " + id + " n'a pas été trouvée."
        });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération de la plante avec l'ID " + id
      });
    });
};

// Update a plant by its id
exports.editPlante = (req, res) => {

  let plant = {
    nom: req.body.nom,
  };

  if (!req.file) {

  }
  Plante.update({...plant}, {
    where: { id: req.params.id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "La plante a été mise à jour avec succès."
        });
      } else {
        res.send({
          message: "Impossible de mettre à jour la plante avec l'ID " + req.params.id + ". Peut-être que la plante n'a pas été trouvée ou que les données à mettre à jour sont vides."
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour de la plante avec l'ID " + req.params.id
      });
    });
};

// Delete a plant by its id
exports.delete = (req, res) => {
  const id = req.params.id;

  Plante.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "La plante a été supprimée avec succès."
        });
      } else {
        res.send({
          message: "Impossible de supprimer la plante avec l'ID " + id + ". Peut-être que la plante n'a pas été trouvée."
        });
      }
    })
    .catch(err => {
      res.status(500)
    })
};

exports.uploadPhoto = async (req, res) => {

  const { id } = req.params;
  try {
    let plante = await Plante.findByPk(id);
    if (!plante) {
      return res.status(404).json({ message: 'Plante non trouvée' });
    }
    if(!req.file){
      return res.status(400).json({ message: 'Fichier manquant' });
    }

    let profile = await Profile.findByPk(plante.ProfileId);
    if(profile.userUid !== res.locals.userId && !res.locals.isAdmin){
      res.status(403).json({ message: 'Vous ne pouvez pas accéder à cette mission' });
    }

    let photo = await Photo.create({
      PlanteId: plante.id,
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
    let plante = await Plante.findByPk(photo.PlanteId);

    if (!plante) {
      return res.status(404).json({ message: 'Plante non trouvée' });
    }

    let profile = await Profile.findByPk(plante.ProfileId);
    if(profile.userUid !== res.locals.userId && !res.locals.isAdmin){
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