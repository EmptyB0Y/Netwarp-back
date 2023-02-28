'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasOne(models.Profile,{
        onDelete: 'CASCADE' 
      });
    }

    
  }
  User.init({
    ProfileId:{
      type: DataTypes.INTEGER,
      references: {
        model: 'Profile',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    uid:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
      },
    email:{ 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    access: { 
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};