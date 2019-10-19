'use strict';
module.exports = (sequelize, DataTypes) => {
  const Medicine = sequelize.define('Medicine', {
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
    time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Medicine'
  });
  Medicine.associate = function (models) {
    // associations can be defined here
  };
  return Medicine;
};
