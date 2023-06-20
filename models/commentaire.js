'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commentaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Commentaire.belongsTo(models.Post,{
        onDelete: 'CASCADE' 
      });
      models.Commentaire.belongsTo(models.Profile),{
        onDelete: 'CASCADE' 
      };
    }
  }
  Commentaire.init({
    ProfileId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    PostId:{
      allowNull: false,
      type: DataTypes.INTEGER
    },
    content:{
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Commentaire',
  });
  return Commentaire;
};