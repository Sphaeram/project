const moment = require("moment-timezone");

const TIME_ZONE = `Asia/karachi`;

//* Convert Date To UTC
const convertDateToUTC = (date, time) => {
  const newdate = moment(date, "YYYY-MM-DD");
  const newtime = moment(time, "h:mm A");
  const UTC_Date = newdate.set({
    hour: newtime.hours(),
    minute: newtime.minutes(),
    second: newtime.seconds(),
  });

  return UTC_Date.utc().format();
};

//* Convert Times to UTC
const convertTimeToUTC = (time) => {
  const UTC_Time = moment(time, "h:mm A").utc();
  if (UTC_Time.isBefore(moment(), "hour")) UTC_Time.add(1, "day");
  const desiredFormat = UTC_Time.format("HH:mm:ss");

  return desiredFormat;
};

const parseTime = (time, tz = TIME_ZONE) => moment.utc(time, "HH:mm:ss").tz(tz).format("h:mm A");
const parseDate = (date, tz = TIME_ZONE) => moment.utc(date).tz(tz).format("YYYY-MM-DD");

const createIntervals = (slot) => {
  const openingMoment = moment.tz(slot.opening_time, "HH:mm:ss", "UTC");
  const closingMoment = moment.tz(slot.closing_time, "HH:mm:ss", "UTC");

  if (closingMoment.isBefore(openingMoment)) {
    closingMoment.add(1, "day");
  }

  const intervs = [];
  let currentMoment = openingMoment.clone();

  while (currentMoment.isBefore(closingMoment)) {
    const nextMoment = currentMoment.clone().add(slot.time_slot, "minutes");
    if (nextMoment.isAfter(closingMoment)) {
      break;
    }
    intervs.push({
      start_time: currentMoment.format("HH:mm:ss"),
      end_time: nextMoment.format("HH:mm:ss"),
      interval_duration: slot.time_slot,
      interval_status: 1,
      time_slot_id: slot.time_slot_id,
    });
    currentMoment = nextMoment;
  }
  return intervs;
};

module.exports = { convertDateToUTC, convertTimeToUTC, parseTime, parseDate, createIntervals };
