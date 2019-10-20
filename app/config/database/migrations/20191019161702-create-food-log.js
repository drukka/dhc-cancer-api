'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FoodLog', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      timeEntryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TimeEntry',
          key: 'id'
        }
      },
      foodId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('FoodLog');
  }
};
