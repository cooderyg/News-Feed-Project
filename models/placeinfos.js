'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlaceInfos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PlaceInfos.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    foodType: DataTypes.STRING,
    priceRange: DataTypes.STRING,
    openingHours: DataTypes.STRING,
    star: DataTypes.NUMBER,
    placeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PlaceInfos',
  });
  return PlaceInfos;
};