'use strict';

const { TimeEntry, DataLog, FoodLog, Weight, Temperature } = require('../../models');

const timeEntryResponse = data => {
  let resp = {
    'type': '',
    'time': null,
    'weight': null,
    'temperature': null,
    'startTime': null,
    'length': null,
    'awake': null,
    'rem': null,
    'light': null,
    'deep': null
  };

  if (data.DataLog) {
    if (data.DataLog.Weight) {
      Object.assign(resp, {
        type: 'weight',
        time: data.DataLog.Weight.time,
        weight: data.DataLog.Weight.weight
      });
    } else if (data.DataLog.Temperature) {
      Object.assign(resp, {
        type: 'temperature',
        time: data.DataLog.Temperature.time,
        temperature: data.DataLog.Temperature.temperature
      });
    }
  } else if (data.FoodLog) {
    Object.assign(resp, {
      type: 'meal'
    });
  }

  return resp;
};

const findTimeEntryById = id => TimeEntry.findOne({
  where: {
    id
  },
  include: [{
    model: DataLog,
    include: [Weight, Temperature]
  }, {
    model: FoodLog
  }]
});

const createTimeEntry = async (user, data) => {
  const timeEntry = await user.createTimeEntry();

  if (data.type === 'weight') {
    const dataLog = await timeEntry.createDataLog();
    await dataLog.createWeight(data);
  } else if (data.type === 'temperature') {
    const dataLog = await timeEntry.createDataLog();
    await dataLog.createTemperature(data);
  }

  const resp = await findTimeEntryById(timeEntry.id);

  return timeEntryResponse(resp);
};

const listTimeEntries = user => {
  return TimeEntry.findAll({
    where: {
      userId: user.id
    },
    include: [{
      model: DataLog,
      include: [Weight, Temperature]
    }, {
      model: FoodLog
    }],
    order: [['id', 'DESC']]
  });
};

module.exports = {
  timeEntryResponse,
  createTimeEntry,
  listTimeEntries
};
