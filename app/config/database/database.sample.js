'use strict';

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    }
  },
  test: {
    username: 'root',
    password: 'let_me_in',
    database: 'pipelines',
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    }
  },
  staging: {
    username: 'root',
    password: process.env.MYSQL_STAGING_PASSWORD,
    database: 'skeleton',
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    }
  },
  production: {
    username: '',
    password: null,
    database: '',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
