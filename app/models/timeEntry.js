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
    TimeEntry.hasOne(models.Treatment, {
      foreignKey: 'timeEntryId'
    });

    TimeEntry.hasOne(models.Visit, {
      foreignKey: 'timeEntryId'
    });

    TimeEntry.hasOne(models.Medicine, {
      foreignKey: 'timeEntryId'
    });

    TimeEntry.hasOne(models.Diagnosis, {
      foreignKey: 'timeEntryId'
    });

    TimeEntry.hasOne(models.FoodLog, {
      foreignKey: 'timeEntryId'
    });

    TimeEntry.hasOne(models.DataLog, {
      foreignKey: 'timeEntryId'
    });
  };
  return TimeEntry;
};
