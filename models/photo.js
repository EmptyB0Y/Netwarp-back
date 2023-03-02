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
      models.Photo.belongsTo(models.Plante,{
        onDelete: 'CASCADE' 
      });
      models.Photo.belongsTo(models.Mission),{
        onDelete: 'CASCADE' 
      };
    }
  }
  Photo.init({
    PlanteId:{
      type: DataTypes.INTEGER
    },
    MissionId: {
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