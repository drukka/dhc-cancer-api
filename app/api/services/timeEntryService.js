'use strict';

const { TimeEntry, DataLog, FoodLog, Weight, Temperature } = require('../../models');

const timeEntryResponse = data => {
  let resp = {};
  if (data.DataLog) {
    resp.type = 'dataLog';
    if (data.DataLog.Weight) {
      resp.value = {
        type: 'weight',
        value: {
          time: data.DataLog.Weight.time,
          weight: data.DataLog.Weight.weight
        }
      };
    } else if (data.DataLog.Temperature) {
      resp.value = {
        type: 'temperature',
        value: {
          time: data.DataLog.Temperature.time,
          temperature: data.DataLog.Temperature.temperature
        }
      };
    }
  } else if (data.FoodLog) {
    resp.type = 'foodLog';
    resp.value = {
      asd: 'asd'
    };
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

  if (data.type === 'dataLog') {
    const dataLog = await timeEntry.createDataLog();

    if (data.value.type === 'weight') {
      await dataLog.createWeight(data.value.value);
    } else if (data.value.type === 'temperature') {
      await dataLog.createTemperature(data.value.value);
    }
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
    }]
  });
};

module.exports = {
  timeEntryResponse,
  createTimeEntry,
  listTimeEntries
};
