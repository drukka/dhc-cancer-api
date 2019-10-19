'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    fullname: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING
    },
    typeOfCancer: {
      type: DataTypes.STRING
    },
    currentStage: {
      type: DataTypes.STRING
    },
    activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      references: {
        model: 'UserRole',
        key: 'id'
      }
    },
    birthdate: {
      type: DataTypes.DATE
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other')
    },
    height: {
      type: DataTypes.INTEGER
    },
    weight: {
      type: DataTypes.INTEGER
    },
    anonymousShare: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'User',
    indexes: [{
      unique: true,
      fields: ['email']
    }]
  });
  User.associate = function (models) {
    User.hasMany(models.PasswordResetCode, {
      foreignKey: 'userId'
    });

    User.hasOne(models.EmailActivation, {
      foreignKey: 'userId'
    });

    User.hasMany(models.AuthCode, {
      foreignKey: 'userId'
    });

    User.belongsTo(models.UserRole, {
      foreignKey: 'roleId'
    });
  };
  return User;
};
