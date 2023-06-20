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
      models.Mission.belongsTo(models.Profile,{
        onDelete: 'CASCADE' 
      });
      models.Mission.hasMany(models.Post,{
        onDelete: 'CASCADE' 
      });
      models.Mission.hasMany(models.Photo,{
        onDelete: 'CASCADE' 
      });
    }
  }
  Mission.init({
    ProfileId:{
      type: DataTypes.INTEGER,
    },
    PostId:{
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
    accomplie:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Mission',
  });
  return Mission;
};