"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        targetKey: "userId",
        foreignKey: "UserId",
      });
      this.belongsTo(models.Places, {
        targetKey: "placeId",
        foreignKey: "PlaceId",
      });
      this.hasMany(models.ReviewImages, {
        sourceKey: "reviewId",
        foreignKey: "ReviewId",
      });
    }
  }
  Reviews.init(
    {
      reviewId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      PlaceId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      rating: {
        allowNull: false,
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
      modelName: "Reviews",
    }
  );
  return Reviews;
};
