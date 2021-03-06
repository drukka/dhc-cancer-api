'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const dbConfig = require('../config/database/database')[process.env.NODE_ENV || 'development'];
const sequelize = new Sequelize(dbConfig);

const basename = path.basename(__filename);
let db = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));

    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// we export the sequelize instance in order to use transactions
db['sequelize'] = sequelize;

module.exports = db;
