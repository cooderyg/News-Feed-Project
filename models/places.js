"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Places extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.PlaceCategories, {
        targetKey: "placeCategoryId",
        foreignKey: "PlaceCategoryId",
      });
      this.hasMany(models.Likes, {
        sourceKey: "placeId",
        foreignKey: "PlaceId",
      });
      this.hasMany(models.Reviews, {
        sourceKey: "placeId",
        foreignKey: "PlaceId",
      });
      this.hasMany(models.Menus, {
        sourceKey: "placeId",
        foreignKey: "PlaceId",
      });
    }
  }
  Places.init(
    {
      placeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      PlaceCategoryId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phoneNumber: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      foodType: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      priceRange: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      openingHours: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      imageUrl: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      star: {
        allowNull: true,
        type: DataTypes.INTEGER,
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
      modelName: "Places",
    }
  );
  return Places;
};
