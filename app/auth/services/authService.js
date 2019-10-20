'use strict';

const { expressError } = require('../../lib');
const { AUTH_JWT_SECRET } = require('../../config');
const { utils } = require('../../lib');
const { userService } = require('../../api/services');

const generateJWTToken = (payload, authCode) => {
  return utils.generateJWTToken(Object.assign(
    {},
    payload,
    {
      authCode
    }
  ),
  AUTH_JWT_SECRET);
};

const createAuthToken = async payload => {
  const authCode = utils.generateRandomNumber(8);
  const token = generateJWTToken(payload, authCode);

  await userService.saveAuthCode(payload.userId, authCode);
  return token;
};

// oas-tools specific
const verifyToken = async (req, secDef, token, next) => {
  try {
    const bearerRegex = /^Bearer\s/;

    if (token && bearerRegex.test(token)) {
      const newToken = token.replace(bearerRegex, '');
      const decoded = await utils.verifyJWTToken(newToken, AUTH_JWT_SECRET);

      const user = userService.getUserById(decoded.userId);
      const authCodeCheck = userService.checkAuthCode(decoded.userId, decoded.authCode);
      if (decoded && await user && await authCodeCheck) {
        req.res.locals.currentUser = await user;
        req.res.locals.currentAuthCode = decoded.authCode;
        return next();
      }
    }
  } catch (error) {
    next(expressError.UNAUTHORIZED('User authentication failed'));
  }

  next(expressError.UNAUTHORIZED('User authentication failed'));
};

module.exports = {
  createAuthToken,
  verifyToken
};
