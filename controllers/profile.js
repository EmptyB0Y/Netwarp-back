const {Sequelize,sequelize, User, Profile} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postProfile = (req, res) => {

    if (!req.body.username) {
    return res.status(400).send(new Error('Bad request !'));
  }

  let profileCreated = {
    userUid : res.locals.userId,
    username : req.body.username,
    pictureUrl: null,
    isBotaniste: false
  };
  
  if(req.file){
    profileCreated.pictureUrl = `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}`;
  }

  User.findOne({where:{uid: res.locals.userId, ProfileId: null}
  }).then(user => {
    console.log(user);

    if(user == null){
      return res.status(403).json("Cet utilisateur a deja un profil"); 
    }
    Profile.create(profileCreated).then((profile) => {

        userModified = {...user};
        user.setProfile(profile);
                
        User.update({...user,ProfileId : profile.id},{where:{uid : res.locals.userId}})
          .then(() => {
              res.status(201).json(profileCreated);
          });
      })
      .catch((e) => {
        res.status(500).json({error : e})
    });
  }).catch(e => {
    res.status(403).json({error : e});
  });
};

exports.getAllProfiles = (req, res) => {
  Profile.findAll().then((profiles) => {
    res.status(200).json(profiles);
  })
  .catch((e) => {
    res.status(404).json({e})
  });
};

exports.getProfile = (req, res) => {
  Profile.findOne({where: {id : req.params.id}}).then((profile) => {
    res.status(200).json(profile);
  })
  .catch((e) => {
    res.status(404).json({e})
  });
};

exports.editProfile = (req, res) => {
  Profile.findOne({where: {id : req.params.id}}).then((profile) => {

    let ProfileUpdated = {
    ...profile,
    username: req.body.username
    };
    
    if(req.file){
      ProfileUpdated.pictureUrl = `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}`;
    }

    Profile.update({...ProfileUpdated}, {where: {id : profile.id}}).then(profileUpdated => {
      res.status(201).json(profileUpdated);
    })
    .catch((e) => {
      res.status(500).json(e)
    });
  })
  .catch((e) => {
    res.status(404).json(e)
  });
};

exports.deleteProfile = (req, res) => {
  Profile.findOne({where: {id : req.params.id}}).then((profile) => {
    if(profile.userUid == res.locals.userId || res.locals.isAdmin){
      Profile.destroy({where: {id : req.params.id}})
      .then(() => {
        User.update({ProfileId : null},{where:{uid : res.locals.userId}}).then(() => {
          res.status(204).json({})
        });

      })
      .catch((e) => {
        res.status(500).json({e})
      });

    }
  })
  .catch((e) => {
    res.status(404).json(e)
  });
};