'use strict';
module.exports = (sequelize, DataTypes) => {
  const Visit = sequelize.define('Visit', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    timeEntryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TimeEntry',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'Visit'
  });
  Visit.associate = function (models) {
    // associations can be defined here
  };
  return Visit;
};
