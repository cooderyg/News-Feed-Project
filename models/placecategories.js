"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlaceCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Places, {
        sourceKey: "placeCategoryId",
        foreignKey: "PlaceCategoryId",
      });
    }
  }
  PlaceCategories.init(
    {
      placeCategoryId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "PlaceCategories",
    }
  );
  return PlaceCategories;
};
