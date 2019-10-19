'use strict';
module.exports = (sequelize, DataTypes) => {
  const Diagnosis = sequelize.define('Diagnosis', {
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
    }
  }, {
    tableName: 'Diagnosis'
  });
  Diagnosis.associate = function (models) {
    Diagnosis.hasMany(models.Document, {
      foreignName: 'diagnosisId'
    });
  };
  return Diagnosis;
};
