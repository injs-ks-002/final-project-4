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
      // define association here
      this.belongsTo(models.User, {
        as: 'User',
        foreignKey: 'UserId',
      })
      this.belongsTo(models.Photo, {
        foreignKey: 'PhotoId',
        as: 'Photo'
      })
    }
  }
  Comment.init({
    UserId: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
        notEmpty: true
      }
    },
    PhotoId: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
        notEmpty: true
      }
    },
    comment: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
    freezeTableName: true
  });
  return Comment;
};