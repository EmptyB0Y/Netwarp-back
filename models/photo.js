'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Photo.belongsTo(models.Post,{
        onDelete: 'CASCADE' 
      });
      models.Photo.belongsTo(models.Mission),{
        onDelete: 'CASCADE' 
      };
      models.Photo.belongsTo(models.Comment),{
        onDelete: 'CASCADE' 
      };
    }
  }
  Photo.init({
    PostId:{
      type: DataTypes.INTEGER
    },
    MissionId: {
      type: DataTypes.INTEGER
    },
    CommentId: {
      type: DataTypes.INTEGER
    },
    url:{
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};