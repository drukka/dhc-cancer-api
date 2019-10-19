'use strict';
module.exports = (sequelize, DataTypes) => {
  const Weight = sequelize.define('Weight', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weight: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    tableName: 'Weight'
  });
  Weight.associate = function (models) {
    // associations can be defined here
  };
  return Weight;
};
