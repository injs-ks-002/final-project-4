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
      // define association here
      this.hasMany(models.Photo, {
        as : "photos",
        foreignKey : "UserId"
      })
      this.hasMany(models.SocialMedia, {
        foreignKey: 'UserId',
        as: 'SocialMedia'
      })
      this.hasMany(models.Comment, {
        foreignKey: 'UserId',
        as: 'User'
      })
    }
  }
  User.init({
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    profile_image_url: DataTypes.TEXT,
    age: DataTypes.INTEGER,
    phone_number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};