'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Menus.init({
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    placeInfoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Menus',
  });
  return Menus;
};