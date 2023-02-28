'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Mission.belongsTo(models.Profile);
      models.Mission.hasMany(models.Plante,{
        onDelete: 'CASCADE' 
      });
    }
  }
  Mission.init({
    ProfileId:{
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    PlanteId:{
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    description:{
      allowNull: false,
      type: DataTypes.STRING,
    },
    dateDebut:{
      allowNull: false,
      type: DataTypes.DATE
    },
    dateFin:{
      allowNull: false,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Mission',
  });
  return Mission;
};