const {Sequelize,sequelize, Post, Profile, Photo} = require('../models');
const fs = require('fs');

// Create a new post
exports.createPost = (req, res) => {
  // Validate request
  if (!req.body.content) {
    res.status(400).json({
      message: "Le contenu ne peut pas être vide."
    });
    return;
  }

  topic = 'general'
  if(req.body.topic) {
    topic = req.body.topic
  }
  // Create a post object
  const post = {
    content: req.body.content,
    topic: topic
  };

  // Save post in the database
  Profile.findOne({where: {UserId: res.locals.userId}}).then(profile => {
    if(!profile) {
      res.status(500).json({message : "Pas de profil trouvé"});
    }
    Post.create({...post,ProfileId: profile.id})
      .then(postCreated => {
        //Profile.update({...profile,PostId:postCreated.id}, {where: {UserId: res.locals.userId}}).then(() => {
          res.json(postCreated);
        //});
      });
    })
    .catch(err => {
      res.status(500).json({
        message:
          err.message || "Une erreur est survenue lors de la création de la post."
      });
    });
};

// Retrieve all posts from the database
exports.findAllPostsByProfile = (req, res) => {
  Post.findAll({where:{ProfileId : req.params.id}, include: ['Mission', 'Profile'] })
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({
        message:
          err.message || "Une erreur est survenue lors de la récupération des posts."
      });
    });
};

exports.findAllPostsByTopic = (req, res) => {
  Post.findAll({where:{topic : req.params.topic}, include: ['Mission', 'Profile'] })
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({
        message:
          err.message || "Une erreur est survenue lors de la récupération des posts."
      });
    });
};

// Find a single post with an id
exports.findPost = (req, res) => {
  Post.findOne({where : { id: req.params.id} })
    .then(post => {
      console.log(post);
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

// Update a post by its id
exports.editPost = (req, res) => {

  let post = {
    nom: req.body.nom,
  };
  Profile.findOne({where: {UserId: res.locals.userId}}).then(profile => {
    if(!profile) {
      res.status(500).json({message : "Pas de profil trouvé"});
    }
    
    let where = { id: req.params.id, ProfileId: profile.id}

    if(res.locals.isAdmin){
      where = { id: req.params.id }
    }
    
    Post.update({...post}, {
      where: where
    })
      .then(num => {
        if (num == 1) {
          res.status(200).json({
            message: "La post a été mise à jour avec succès."
          });
        } else {
          res.status(400).json({
            message: "Impossible de mettre à jour la post avec l'ID " + req.params.id + ". Peut-être que la post n'a pas été trouvée ou que les données à mettre à jour sont vides."
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: "Erreur lors de la mise à jour de la post avec l'ID " + req.params.id
        });
      });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

// Delete a post by its id
exports.deletePost = (req, res) => {

  Profile.findOne({where: {UserId: res.locals.userId}}).then(profile => {
    if(!profile) {
      res.status(500).json({message : "Pas de profil trouvé"});
    }
    
    let where = { id: req.params.id, ProfileId: profile.id}

    if(res.locals.isAdmin){
      where = { id: req.params.id }
    }

    Post.destroy({
      where: where
    })
    .then(num => {
      if (num == 1) {
        res.json({
          message: "La post a été supprimée avec succès."
        });
      } else {
        res.json({
          message: "Impossible de supprimer la post avec l'ID " + id + ". Peut-être que la post n'a pas été trouvée."
        });
      }
    })
    .catch(err => {
      res.status(500)
    })
  })
  .catch(err => {
    res.status(500).json(err);
  });
};

exports.uploadPhoto = async (req, res) => {

  const { id } = req.params;
  try {
    let post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvée' });
    }
    if(!req.file){
      return res.status(400).json({ message: 'Fichier manquant' });
    }

    let profile = await Profile.findByPk(post.ProfileId);
    if(profile.UserId !== res.locals.userId && !res.locals.isAdmin){
      res.status(403).json({ message: 'Vous ne pouvez pas accéder à cette mission' });
    }

    let photo = await Photo.create({
      PostId: post.id,
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
    let post = await Post.findByPk(photo.PostId);

    if (!post) {
      return res.status(404).json({ message: 'Post non trouvée' });
    }

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