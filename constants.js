const db = require("./models");

const FARE_DROP_POINT_INCLUDE_QUERIES = [
  {
    model: db.airport,
    as: "airport_drop",
    attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
  },
  {
    model: db.railway_station,
    as: "railway_drop",
    attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
  },
  {
    model: db.hotel,
    as: "hotel_drop",
    attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
  },
];

module.exports = {
  FARE_DROP_POINT_INCLUDE_QUERIES,
};
