const db = require('../models');

// Create a new plant
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nom) {
    res.status(400).send({
      message: "Le nom ne peut pas être vide."
    });
    return;
  }

  // Create a plant object
  const plant = {
    ProfileId: req.body.ProfileId,
    MissionId: req.body.MissionId,
    nom: req.body.nom,
    commentaires: req.body.commentaires,
    photos: req.body.photos
  };

  // Save plant in the database
  db.Plante.create(plant)
    .then(data => {
      res.send(data);
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
  db.Plante.findAll({ include: ['Mission', 'Profile'] })
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

  db.Plante.findByPk(id, { include: ['Mission', 'Profile', 'Commentaire'] })
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
exports.update = (req, res) => {
  const id = req.params.id;

  db.Plante.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "La plante a été mise à jour avec succès."
        });
      } else {
        res.send({
          message: "Impossible de mettre à jour la plante avec l'ID " + id + ". Peut-être que la plante n'a pas été trouvée ou que les données à mettre à jour sont vides."
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour de la plante avec l'ID " + id
      });
    });
};

// Delete a plant by its id
exports.delete = (req, res) => {
  const id = req.params.id;

  db.Plante.destroy({
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
}