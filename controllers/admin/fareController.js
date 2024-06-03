const { FARE_DROP_POINT_INCLUDE_QUERIES } = require("../../constants");
const db = require("../../models");
const { sanitizeFields } = require("../../utils/otherUtils");

const allowedFields = ["location_type", "pickup_point", "drop_point", "car_id", "fare"];

module.exports = {
  createfare: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    try {
      const fare = await db.fare.create(sanitizedFields);
      return res.status(200).json({ data: fare });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  updatefareById: async (req, res, next) => {
    const { fareId } = req.query;
    if (!fareId) return res.status(400).json({ data: "Bad Request!" });
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    try {
      const [rowsAffected] = await db.fare.update(sanitizedFields, {
        where: { id: fareId },
      });
      if (rowsAffected === 0) return res.status(500).json({ data: "No fare Updated!" });
      return res.status(200).json({ data: "fare Updated!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  // todo: PENDING TO INLCUDE EVERYTHING
  getAllfares: async (req, res, next) => {
    try {
      const fares = await db.fare.findAll({
        include: [
          {
            model: db.car,
            attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
          },
        ],
      });
      if (!fares || fares.length === 0) return res.status(404).json({ data: "No fares Found!" });
      return res.status(200).json({ data: fares });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getAllAirportFairs: async (req, res, next) => {
    try {
      const airportFares = await db.fare.findAll({
        attributes: ["id", "location_type", "fare"],
        where: { location_type: "airport" },
        include: [
          {
            model: db.car,
            attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
          },
          {
            model: db.airport,
            as: "airport_pickup",
            attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
          },
          ...FARE_DROP_POINT_INCLUDE_QUERIES,
        ],
      });
      if (!airportFares || airportFares.length === 0)
        return res.status(404).json({ data: "No fares Found!" });

      const fares = airportFares.map((fare) => fare.toJSON());

      fares.forEach((element) => {
        if (!element.airport_drop) delete element.airport_drop;
        if (!element.railway_drop) delete element.railway_drop;
        if (!element.hotel_drop) delete element.hotel_drop;
      });

      return res.status(200).json({ data: fares });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getAllTrainFairs: async (req, res, next) => {
    try {
      const trainFares = await db.fare.findAll({
        attributes: ["id", "location_type", "fare"],
        where: { location_type: "railway" },
      });
      if (!trainFares || trainFares.length === 0)
        return res.status(404).json({ data: "No fares Found!" });

      const fares = trainFares.map((fare) => fare.toJSON());

      fares.forEach((element) => {
        if (!element.airport_drop) delete element.airport_drop;
        if (!element.railway_drop) delete element.railway_drop;
        if (!element.hotel_drop) delete element.hotel_drop;
      });

      return res.status(200).json({ data: fares });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getfareById: async (req, res, next) => {
    const { fareId } = req.query;
    if (!fareId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const fare = await db.fare.findByPk(fareId);
      if (!fare) return res.status(404).json({ data: "No fare Found!" });
      return res.status(200).json({ data: fare });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  fareSearch: async (req, res, next) => {
    const { car_id } = req.query;
    if (!car_id) return res.status(400).json({ data: "Bad Request!" });
    try {
      const airports = await db.airport.findAll({ where: { car_id: car_id } });
      const hotels = await db.hotel.findAll({ where: { car_id: car_id } });
      const railways = await db.railway_station.findAll({ where: { car_id: car_id } });

      const data = {
        airports: [...airports],
        hotels: [...hotels],
        railways: [...railways],
      };

      return res.status(200).json({ data: data });
    } catch (error) {
      return res.status(200).json({ data: error.message });
    }
  },

  deletefareById: async (req, res, next) => {
    const { fareId } = req.query;
    if (!fareId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const fare = await db.fare.findByPk(fareId);
      if (!fare) return res.status(404).json({ data: "No fare Found!" });
      await db.fare.destroy({ where: { id: fare.id } });
      return res.status(200).json({ data: "fare Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
