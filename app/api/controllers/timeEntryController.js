'use strict';

const { expressError } = require('../../lib');
const { timeEntryService, userService } = require('../services');

exports.createTimeEntry = async (req, res, next) => {
  try {
    const timeEntry = await timeEntryService.createTimeEntry(res.locals.currentUser, req.body);
    res.status(201).send(timeEntry);
  } catch (error) {
    next(error);
  }
};

exports.listMyTimeEntries = async (req, res, next) => {
  try {
    const timeEntries = await timeEntryService.listTimeEntries(res.locals.currentUser);

    if (timeEntries.length === 0) {
      return next(expressError.NO_CONTENT());
    }

    res.send(timeEntries.map(timeEntryService.timeEntryResponse));
  } catch (error) {
    next(error);
  }
};

exports.listUsersTimeEntries = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.swagger.params.userId.value);
    const timeEntries = await timeEntryService.listTimeEntries(user);

    if (timeEntries.length === 0) {
      return next(expressError.NO_CONTENT());
    }

    res.send(timeEntries.map(timeEntryService.timeEntryResponse));
  } catch (error) {
    next(error);
  }
};
