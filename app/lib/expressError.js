'use strict';

const createError = httpStatus => message => ({
  httpStatus,
  customErrorMessage: {
    message
  }
});

module.exports = {
  BAD_REQUEST: createError(400),
  UNAUTHORIZED: createError(401),
  FORBIDDEN: createError(403),
  NOT_FOUND: createError(404),
  NOT_ACCEPTED: createError(406),
  CONFLICT: createError(409),
  NO_CONTENT: createError(204)
};
