const {sequelize, Test} = require('../models');

exports.getAllTests = (req,res) =>{
  if(req.params.topic === "notopic"){
    Test.findAll({ order: [['createdAt', 'DESC']]})
      .then(Tests => res.status(200).json(Tests))
      .catch(error => res.status(500).json({ error }));
  }
  else{
    Test.findAll({where:{topic:req.params.topic}, order: [['createdAt', 'DESC']]})
    .then(Tests => res.status(200).json(Tests))
    .catch(error => res.status(500).json({ error }));
  }
};


exports.postTest = (req, res) => {

    if (!req.body.content) {
    return res.status(400).send(new Error('Bad request !'));
  }

  let TestCreated = {...req.body};
  TestCreated.userId = res.locals.userId;

  if(req.file){
    TestCreated.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }

  if(TestCreated.topic){
    if(TestCreated.topic === ''){
      TestCreated.topic = 'notopic';
    }
  }

  Test.create({...TestCreated}).then(() => {
      res.status(201).json({message: "Objet créé !"});
    })
    .catch(() => {
      res.status(500).json({message: "Erreur lors de la création de l'objet !"})
  });
};

exports.editTest = (req,res) => {

  if (!(req.body.content &&  
    !req.body.likes &&
    !req.body.dislikes &&
    !req.body.usersLiked &&
    !req.body.usersDisliked &&
    !req.body.comments) && !req.body.test) {
      return res.status(400).send(new Error('Bad request!')
        );
  }
  
  let TestModified;
  if(req.body.test){
    /*Test format : 
    {"content":"..."}*/
    
    TestModified = JSON.parse(req.body.test);
  }
  else{
    TestModified = { ...req.body};
    if(TestModified.likes || 
      TestModified.dislikes || 
      TestModified.usersDisliked || 
      TestModified.usersLiked || 
      TestModified.comments){
        return res.status(403).send(new Error('Forbidden !'));
      }
  }
  if(req.file){
    TestModified.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }

  Test.findOne({where:{uid : req.params.id}})
  .then(test => {
    User.findOne({where:{ uid: res.locals.userId }})
    .then(userFound => {
      if (res.locals.userId !== test.userId && userFound.access !== "admin"){
        return res.status(401).json({message: "Unauthorized !"});
      }

      TestModified.userId = test.userId;
      Test.update({...TestModified}, {where:{uid: req.params.id}})
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => {
        res.status(400).json({ error })
      });
    });
  })
  .catch(error => res.status(404).json({ error }));
};

exports.deleteTest = (req,res) => {

  Test.findOne({where:{uid: req.params.id}})
    .then(test => {
      User.findOne({where:{uid: res.locals.userId}})
      .then(userFound => {
        if (res.locals.userId !== test.userId && userFound.access !== "admin"){
          return res.status(401).json({message: "Unauthorized !"});
        }
        Test.destroy({where:{ uid: req.params.id}})
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(404).json({ message: "Objet non trouvé  !" });
    });
};

exports.testLike = (req,res) => {

  if(req.body.like && req.body.like === 1 || req.body.like === -1){
    Test.findOne({where:{ uid: req.params.id}})
    .then(test => {

      if(test.userId === res.locals.userId){
        return res.status(403).json({message: "Forbidden !"});
      }
      let TestLiked = {
        "userId": test.userId,
        "content": test.content,
        "imageUrl": test.imageUrl,
        "likes": test.likes,
        "dislikes": test.dislikes,
        "usersLiked": test.usersLiked,
        "usersDisliked": test.usersDisliked,
        "comments": test.comments
      };
      //Like
      if(req.body.like === 1){
        if(!TestLiked.usersLiked.includes(String(res.locals.userId))){
          TestLiked.likes += 1;
          TestLiked.usersLiked.push(String(res.locals.userId));
          if(TestLiked.usersDisliked.includes(String(res.locals.userId))){
            TestLiked.dislikes -= 1;
            TestLiked.usersDisliked.splice(TestLiked.usersDisliked.indexOf(String(res.locals.userId)));
          }
        }
        //Remove Like
        else{
          TestLiked.likes -= 1;
          TestLiked.usersLiked.splice(TestLiked.usersLiked.indexOf(String(res.locals.userId)));
        }
      }
      //Dislike
      else if(req.body.like === -1){
        if(!TestLiked.usersDisliked.includes(String(res.locals.userId))){
          TestLiked.dislikes += 1;
          TestLiked.usersDisliked.push(String(res.locals.userId));

          if(TestLiked.usersLiked.includes(String(res.locals.userId))){
            TestLiked.likes -= 1;
            TestLiked.usersLiked.splice(TestLiked.usersLiked.indexOf(String(res.locals.userId)));
          }
        }
        //Remove dislike
        else{
          TestLiked.dislikes -= 1;
          TestLiked.usersDisliked.splice(TestLiked.usersDisliked.indexOf(String(res.locals.userId)));  
        }
      }
    
    Test.update( {...TestLiked}, {where:{uid: req.params.id}})
      .then(() => res.status(200).json({ message: 'Like ajouté !'}))
      .catch(() => res.status(500).json({ message: 'Erreur lors de l\'ajout du like !'}));
    })
    .catch(() => res.status(404).json({ message: "Objet non trouvé  !" }));
  }
  else{
    return res.status(400).send(new Error('Bad request!'));
  }
};

exports.getTestSchema = () =>{
  return Test;
}