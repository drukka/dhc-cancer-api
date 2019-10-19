'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      fullname: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      typeOfCancer: {
        type: Sequelize.STRING
      },
      currentStage: {
        type: Sequelize.STRING
      },
      activated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      roleId: {
        type: Sequelize.INTEGER,
        defaultValue: 10,
        references: {
          model: 'UserRole',
          key: 'id'
        }
      },
      birthdate: {
        type: Sequelize.DATE
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other')
      },
      height: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.INTEGER
      },
      anonymousShare: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('User');
  }
};
