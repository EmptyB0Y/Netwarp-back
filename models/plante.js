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
      // define association here
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
    photos: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {
    sequelize,
    modelName: 'Plante',
  });
  return Plante;
};