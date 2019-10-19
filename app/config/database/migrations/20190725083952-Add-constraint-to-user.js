'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('User', ['email'], {
      type: 'unique',
      name: 'uniqueUserEmailConstraint'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('User', 'uniqueUserEmailConstraint');
  }
};
