'use strict';
module.exports = (sequelize, DataTypes) => {
  const TimeEntry = sequelize.define('TimeEntry', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    tableName: 'TimeEntry'
  });
  TimeEntry.associate = function (models) {
    TimeEntry.hasMany(models.Treatment, {
      foreignKey: 'timeEntryId'
    });

    TimeEntry.hasMany(models.Visit, {
      foreignKey: 'timeEntryId'
    });

    TimeEntry.hasMany(models.Medicine, {
      foreignKey: 'timeEntryId'
    });

    TimeEntry.hasMany(models.Diagnosis, {
      foreignKey: 'timeEntryId'
    });

    TimeEntry.hasMany(models.FoodLog, {
      foreignKey: 'timeEntryId'
    });

    TimeEntry.hasMany(models.DataLog, {
      foreignKey: 'timeEntryId'
    });
  };
  return TimeEntry;
};
