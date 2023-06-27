'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Reviews, {
        sourceKey: "userId",
        foreignKey: "UserId",
      });
      this.hasMany(models.Likes, {
        sourceKey: "userId",
        foreignKey: "UserId",
      });
    }
  }
  Users.init({
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};