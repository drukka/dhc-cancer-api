'use strict';
module.exports = (sequelize, DataTypes) => {
  const FoodLog = sequelize.define('FoodLog', {
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
    foodId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'FoodLog'
  });
  FoodLog.associate = function (models) {
    // associations can be defined here
  };
  return FoodLog;
};
