'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User,{
        foreignKey: 'UserId',
        as: "User"
      })
      this.hasMany(models.Comment, {
        foreignKey: 'PhotoId',
        as: 'Comment'
      })
      // this.belongsTo(models.Comment, {
      //   foreignKey: 'PhotoId',
      //   as: 'Comments'
      // })
    }
  }
  Photo.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    caption: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    },
    poster_image_url: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: true,
        notEmpty: true
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};