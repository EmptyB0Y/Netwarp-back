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
      models.Plante.belongsTo(models.Mission);
      models.Plante.belongsTo(models.Profile);
      models.Plante.hasMany(models.Commentaire,{
        onDelete: 'CASCADE' 
      });
    }
  }
  Plante.init({
    ProfileId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    MissionId:{
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    nom: DataTypes.STRING,
    commentaires: DataTypes.ARRAY(DataTypes.INTEGER),
    photos: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'Plante',
  });
  return Plante;
};