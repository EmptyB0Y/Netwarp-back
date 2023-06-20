'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Comment.belongsTo(models.Post,{
        onDelete: 'CASCADE' 
      });
      models.Comment.belongsTo(models.Profile),{
        onDelete: 'CASCADE' 
      };
      models.Comment.hasMany(models.Photo,{
        onDelete: 'CASCADE'
      });
    }
  }
  Comment.init({
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
    modelName: 'Comment',
  });
  return Comment;
};