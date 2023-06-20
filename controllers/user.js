const {Sequelize,sequelize, User, Profile} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

getAuthorizedAdminIps = () =>{
  let str = ""+String(process.env.AUTHORIZED_ADMIN_IPS)+"";
  let tab = [];
  let s = "";
  let j = 0;
  for(let i = 0; i < str.length; i++){
    if(str.charAt(i) === ';'){
      tab[j] = s;
      s = "";
      j++;
    }else{
    s += str.charAt(i); 
    }
  }
  return tab;
}

exports.login = (req,res) =>{
  console.log(req.headers);
  if (!req.body.email || !req.body.password) {
    return res.status(400).send(new Error('Bad request!'));
  }
  User.findOne({where:{ email: req.body.email }}).then(user =>{
    bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        console.log(user.uid)
        res.status(200).json({
          userId: user.uid,
          token: jwt.sign(
            { userId: user.uid },
            process.env.JSON_TOKEN,
            { expiresIn: '24h' }
          ),
          profileId: user.ProfileId
        });
      })
      .catch(error => res.status(500).json({ error }));
    })
    .catch(err =>{
      res.status(404).json({message: 'Utilisateur non trouvé !', error : err})
    });
};

exports.register = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send(new Error('Bad request!'));
  }
    //Utilisation de Bcrypt pour hasher le mot de passe
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    let access = "user";

    if(req.body.superPassword){
      console.log("Admin creation request from "+req.ip);
      const authip = getAuthorizedAdminIps();
      
      let ok = false;
      for(let i = 0; i < authip.length; i++){

        if(authip[i] === ""+req.ip){
          ok = true;
        }
      }

      if (process.env.SUPER_PASS === req.body.superPassword && ok) {
        access = "admin";
      }
      else {
        return res.status(401).json({message: "Unauthorized !"});
      }
    }

    User.create({
      email: req.body.email,
      password: hash,
      access: access
    })
    .then((userCreated)=>{
          res.status(201).json(userCreated);
      })
      .catch(err =>{
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur !', error: err});
      });
  })
  .catch((err) => res.status(500).json({ message: 'Erreur lors du hashage du mot de passe !', error: err}));
}

exports.editUserEmail = (req, res) =>{
  if (!req.body.newEmail) {
    return res.status(400).send(new Error('Bad request!'));
  }

  User.findOne({where:{id : req.params.id}})
  .then((user) =>{
    if(!res.locals.isAdmin && String(user.uid) !== res.locals.userId){
      return res.status(403).json({message: "Forbidden !"});
    }
    let UserModified = {
      email : req.body.newEmail,
      password : user.password,
      access : user.access,
    };
    User.update({...UserModified} ,{where:{uid : user.uid}})
      .then(() => res.status(200).json({ message: 'Utilisateur modifié !'}))
      .catch(() => res.status(400).json({ message: 'Erreur lors de la modification de l\'utilisateur !' }));
  })
  .catch(() => res.status(404).json({message: 'Not found !'}));
}

exports.editUserPassword = (req, res) =>{
  if (!req.body.oldPassword || !req.body.newPassword) {
    return res.status(400).send(new Error('Bad request!'));
  }

  User.findOne({where:{id : req.params.id}})
  .then((user) =>{
    if(!res.locals.isAdmin && String(user.uid) !== res.locals.userId){
      return res.status(403).json({message: "Forbidden !"});
    }
      bcrypt.compare(req.body.oldPassword, user.password)
      .then(valid => {
        if (!res.locals.isAdmin && !valid) {
          return res.status(403).json({ message: 'Mot de passe incorrect !' });
        }

      bcrypt.hash(req.body.newPassword,10)
      .then((hash)=>{
      let UserModified = {
        email : user.email,
        password : hash,
        access : user.access,
      };
      User.update({...UserModified} ,{where:{uid : user.uid}})
        .then(() => res.status(200).json({ message: 'Utilisateur modifié !'}))
        .catch(() => res.status(500).json({ message: 'Erreur lors de la modification de l\'utilisateur !' }));
      })

    })
    .catch(() => res.status(500).json({ message: 'Erreur lors du hashage du mot de passe !' }));
  })
  .catch(() => res.status(404).json({message: 'Not found !'}));
};

exports.deleteUser = async (req, res) =>{

  await User.findOne({where:{id : String(req.params.id)}})
  .then((user) =>{
    if(!res.locals.isAdmin && String(user.uid) !== res.locals.userId){
      return res.status(403).json({message: "Forbidden !"});
    }
    if(String(user.uid) === res.locals.userId){
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(403).json({ error: 'Mot de passe incorrect !' });
          }
        })
      .catch(error => res.status(500).json({ error }));
    }
  })
  .catch(() => res.status(404).json({message: 'User not found !'}));

    User.destroy({where:{id : req.params.id}})
    .then(() => {
      return res.status(204).json({});
    })
    .catch(() => res.status(404).json({message: 'User not found !'}));
};

exports.getOneUser = (req, res) => {

  User.findOne({where:{ id: req.params.id }})
  .then(user => {
    if(res.locals.isAdmin || String(user.uid) === res.locals.userId){
      return res.status(200).json(user)
    }
    else{
      return res.status(403).json({message: "Forbidden !"});
    }
  })
  .catch(() => res.status(404).json({message: 'Not found !'}));
};

//ADMIN
exports.getAllUsers = async (req,res) =>{
  if(res.locals.isAdmin){
    User.findAll()
    .then(Users => res.status(200).json(Users))
    .catch(error => res.status(400).json({ error }));
  }
  else{
    return res.status(403).json({message: "Forbidden !"});
  }
};

exports.getUserSchema = () =>{
  return User;
}