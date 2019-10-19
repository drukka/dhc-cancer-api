'use strict';
module.exports = (sequelize, DataTypes) => {
  const DataLog = sequelize.define('DataLog', {
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
    }
  }, {
    tableName: 'DataLog'
  });
  DataLog.associate = function (models) {
    DataLog.hasMany(models.Weight, {
      foreignKey: 'dataLogId'
    });

    DataLog.hasMany(models.Temperature, {
      foreignKey: 'dataLogId'
    });
  };
  return DataLog;
};
