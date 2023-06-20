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
      models.Profile.hasMany(models.Commentaire,{
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
    userUid:{
      type: DataTypes.UUID,
    },
    username: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    pictureUrl: {
      type: DataTypes.STRING
    },
    isBotaniste: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'Profile', 
  });
  return Profile;
};