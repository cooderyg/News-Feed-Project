'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Likes', {
      likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onDelete: 'CASCADE',
      },
      PlaceId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Places',
          key: 'placeId',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Likes');
  },
};

// // 이걸로 어떻게 하는거 같은데ㅠㅠㅠㅠ...
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.addColumn("Likes", "likesCount", {
//       type: Sequelize.INTEGER,
//       defaultValue: 0,
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.removeColumn("Likes", "likesCount");
//   },
// };
