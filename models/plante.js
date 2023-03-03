'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plante extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Plante.belongsTo(models.Profile,{
        onDelete: 'CASCADE' 
      });
      models.Plante.belongsTo(models.Mission,{
        onDelete: 'CASCADE' 
      });
      models.Plante.hasMany(models.Commentaire,{
        onDelete: 'CASCADE'
      });
      models.Plante.hasMany(models.Photo,{
        onDelete: 'CASCADE' 
      });
    }
  }
  Plante.init({
    ProfileId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    MissionId:{
      type: DataTypes.INTEGER
    },
    nom: {
      type: DataTypes.STRING
    },
    categorie: {
      type: DataTypes.STRING
    }
    }, {
    sequelize,
    modelName: 'Plante',
  });
  return Plante;
};