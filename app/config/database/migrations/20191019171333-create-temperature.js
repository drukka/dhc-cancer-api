'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Temperature', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dataLogId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DataLog',
          key: 'id'
        }
      },
      time: {
        type: Sequelize.STRING,
        allowNull: false
      },
      temperature: {
        type: Sequelize.DOUBLE,
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
    return queryInterface.dropTable('Temperature');
  }
};
