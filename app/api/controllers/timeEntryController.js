'use strict';

const { expressError } = require('../../lib');
const { timeEntryService } = require('../services');

exports.createTimeEntry = async (req, res, next) => {
  try {
    const timeEntry = await timeEntryService.createTimeEntry(res.locals.currentUser, req.body);
    res.status(201).send(timeEntry);
  } catch (error) {
    next(error);
  }
};
