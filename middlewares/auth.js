const jwt = require('jsonwebtoken');
const {Sequelize,sequelize, User} = require('../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JSON_TOKEN);
    const userId = decodedToken.userId;

      res.locals.isAdmin = false;
      console.log(userId);
      await User.findOne({where:{ uid: userId }})
      .then(user => {  
        console.log(user);
        res.locals.userId = user.id;

        if(user.access === "admin"){
          res.locals.isAdmin = true;
        }
      });
      next();
  } catch {
    res.status(401).json({
      error: "Authentication failed !"
    });
  }
};