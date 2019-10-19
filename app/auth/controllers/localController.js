'use strict';

const { expressError } = require('../../lib');
const { userService } = require('../../api/services');
const { authService } = require('../services');

const bcrypt = require('bcrypt');

exports.signUp = async (req, res, next) => {
  try {
    const user = await userService.createUser({
      email: req.body.email,
      password: req.body.password
    });

    const token = await authService.createAuthToken({
      userId: user.id,
      role: 'patient'
    });

    res.status(201).send({
      user: user,
      token: token
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return next(expressError.CONFLICT('Email address is already in use'));
    }

    next(error);
  }
};

exports.checkAuthToken = (req, res, next) => {
  res.send({});
};

exports.signIn = async (req, res, next) => {
  const user = await userService.getUserByEmail(req.body.email);

  if (!user || !await bcrypt.compare(req.body.password, user.password)) {
    return next(expressError.UNAUTHORIZED('Wrong login details'));
  }

  const token = authService.createAuthToken({
    userId: user.id,
    role: user.UserRole.name
  });

  res.send({
    user: userService.userResponse(user),
    token: await token
  });
};
