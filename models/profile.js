'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Profile.belongsTo(models.User,{
        onDelete: 'CASCADE' 
      });
      models.Profile.hasOne(models.Mission,{
        onDelete: 'CASCADE' 
      })
      models.Profile.hasMany(models.Comment,{
        onDelete: 'CASCADE' 
      });
      models.Profile.hasMany(models.Post,{
        onDelete: 'CASCADE' 
      });
    }
  }
  Profile.init({
    UserId:{
       type: DataTypes.INTEGER,
    },
    MissionId:{
      type: DataTypes.INTEGER,
    },
    username: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    pictureUrl: { 
      type: DataTypes.STRING,
      defaultValue: 'http://localhost:3000/images/default/default-profile-picture.png'
    },
    relevance: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    trusted: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Profile', 
  });
  return Profile;
};