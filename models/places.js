'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Places extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Places.init({
    userId: DataTypes.INTEGER,
    placeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Places',
  });
  return Places;
};