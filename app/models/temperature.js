'use strict';
module.exports = (sequelize, DataTypes) => {
  const Temperature = sequelize.define('Temperature', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    dataLogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DataLog',
        key: 'id'
      }
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    temperature: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    tableName: 'Temperature'
  });
  Temperature.associate = function (models) {
    // associations can be defined here
  };
  return Temperature;
};
