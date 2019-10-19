'use strict';

const { expressError } = require('../../lib');
const { userService } = require('../services');

exports.signUp = async (req, res, next) => {
  try {
    const user = userService.createUser({
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname || null,
      lastname: req.body.lastname || null,
      language: res.locals.currentLanguage
    });

    res.status(201).send(await user);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return next(expressError.CONFLICT('Email address is already in use'));
    }

    next(error);
  }
};

exports.getProfile = (req, res, next) => {
  res.send(userService.userResponse(res.locals.currentUser));
};

exports.updateProfile = async (req, res, next) => {
  try {
    await userService.updateProfile(res.locals.currentUser.id);
    res.send({});
  } catch (error) {
    next(error);
  }
};

exports.requestEmailChange = async (req, res, next) => {
  try {
    await userService.requestEmailChange(res.locals.currentUser, req.body.email);

    res.send({});
  } catch (error) {
    switch (error.message) {
      case 'DataValidationFailed':
        next(expressError.BAD_REQUEST('New email has to be different from currently used email.'));
        break;
      case 'Conflict':
        next(expressError.CONFLICT('Email address is already in use'));
        break;
      default:
        next(error);
    }
  }
};

exports.activateEmail = async (req, res, next) => {
  try {
    await userService.activateEmailAddress(req.body.token);

    res.send({});
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return next(expressError.CONFLICT('Email address is already in use'));
    }

    next(expressError.BAD_REQUEST('Token is malformed or expired.'));
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    await userService.changePassword(res.locals.currentUser, req.body.oldPassword, req.body.newPassword, res.locals.currentAuthCode);

    res.send({});
  } catch (error) {
    if (error.message === 'IncorrectPassword') {
      return next(expressError.NOT_ACCEPTED('Old password is incorrect'));
    }

    next(error);
  }
};

exports.checkAuthToken = (req, res, next) => {
  res.send({});
};

exports.sendPasswordResetEmail = async (req, res, next) => {
  try {
    await userService.sendPasswordResetEmail(req.body.email);

    res.send({});
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    await userService.resetPassword(req.body.token, req.body.password);

    res.send({});
  } catch (error) {
    next(expressError.BAD_REQUEST('Token is malformed or expired'));
  }
};

exports.sendActivationEmail = async (req, res, next) => {
  try {
    await userService.sendActivationEmail(res.locals.currentUser, res.locals.currentUser.email);

    res.send({});
  } catch (error) {
    next(error);
  }
};

exports.updateProfilePicture = async (req, res, next) => {
  try {
    await userService.updateProfilePicture(res.locals.currentUser, req.body.profilePicture);

    res.send({});
  } catch (error) {
    next(error);
  }
};

exports.deleteProfilePicture = async (req, res, next) => {
  try {
    await userService.deleteProfilePicture(res.locals.currentUser);

    res.send({});
  } catch (error) {
    next(error);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const users = await userService.listUsers();

    if (users.length === 0) {
      throw new Error('Empty');
    }

    res.send(users.map(userService.userResponse));
  } catch (error) {
    if (error.message === 'Empty') {
      return next(expressError.NO_CONTENT());
    }

    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.swagger.params.userId.value);

    if (!user) {
      throw new Error('NotFound');
    }

    res.send(userService.userResponse(user));
  } catch (error) {
    if (error.message === 'NotFound') {
      return next(expressError.NOT_FOUND('User not found'));
    }

    next(error);
  }
};
