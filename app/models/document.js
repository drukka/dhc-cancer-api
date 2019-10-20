'use strict';
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('Document', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    diagnosisId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Diagnosis',
        key: 'id'
      }
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Document'
  });
  File.associate = function (models) {
    // associations can be defined here
  };
  return File;
};
