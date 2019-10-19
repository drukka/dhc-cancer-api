'use strict';

const { expressError } = require('../../lib');
const { userService } = require('../../api/services');
const { authService } = require('../services');

const bcrypt = require('bcrypt');

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
