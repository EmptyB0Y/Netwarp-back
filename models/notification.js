'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Notification.belongsTo(models.Profile,{
        onDelete: 'CASCADE' 
      });
    }
  }
  Notification.init({
    ProfileId:{
        type: DataTypes.INTEGER,
    },
    content: {
        type: DataTypes.STRING
    },
    target: {
        type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};