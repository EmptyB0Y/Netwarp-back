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
      models.Commentaire.belongsTo(models.Plante,{
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
      type: DataTypes.INTEGER,      
      references: {
        model: 'Profile',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    PlanteId:{
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Plante',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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