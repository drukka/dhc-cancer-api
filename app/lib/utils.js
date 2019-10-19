'use strict';

const { COMPANY } = require('../config');

const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');
const moment = require('moment');

exports.generateRandomString = (length) => {
  let id = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return id;
};

exports.generateRandomNumber = (power = 4) => {
  return Math.floor(Math.random() * Math.pow(10, power));
};

exports.capitalizeFirstLetter = string => {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};

exports.randomElement = array => array[Math.floor(Math.random() * array.length)];

exports.generateJWTToken = (payload, secret) => {
  return new Promise((resolve, reject) => {
    jwt.sign(Object.assign({}, payload, { iss: COMPANY }), secret, (err, token) => {
      if (err) {
        reject(err);
      }

      resolve(token);
    });
  });
};

exports.verifyJWTToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, { issuer: COMPANY }, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      resolve(decoded);
    });
  });
};

exports.saveFileFromBase64String = (file, path) => {
  return new Promise((resolve, reject) => {
    const folder = path.substring(0, path.lastIndexOf('/'));
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    fs.writeFile(path, file, 'base64', (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};

exports.deleteFile = path => {
  return new Promise((resolve, reject) => {
    fs.stat(path, err => {
      if (err) {
        reject(err);
      }

      fs.unlink(path, err => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  });
};

exports.generateHex = () => crypto.createHash('sha256').update(`${Math.random()}${moment().unix()}`).digest('hex');
