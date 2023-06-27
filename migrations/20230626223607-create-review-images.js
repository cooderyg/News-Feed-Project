"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ReviewImages", {
      reviewImageId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ReviewId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Reviews",
          key: "reviewId",
        },
        onDelete: "CASCADE",
      },
      imageUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ReviewImages");
  },
};
