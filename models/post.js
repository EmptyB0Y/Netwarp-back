'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Post.belongsTo(models.Profile,{
        onDelete: 'CASCADE' 
      });
      models.Post.belongsTo(models.Mission,{
        onDelete: 'CASCADE' 
      });
      models.Post.hasMany(models.Comment,{
        onDelete: 'CASCADE'
      });
      models.Post.hasMany(models.Photo,{
        onDelete: 'CASCADE' 
      });
    }
  }
  Post.init({
    ProfileId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    MissionId:{
      type: DataTypes.INTEGER
    },
    content: {
      type: DataTypes.STRING
    },
    topic: {
      type: DataTypes.STRING,
      defaultValue: 'general'
    }
    }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};