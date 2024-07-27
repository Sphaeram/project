const db = require("../../models/index");
const {
  sanitizeFields,
  deleteFile,
  convertToJpeg,
} = require("../../utils/otherUtils");

const allowedFields = ["car_id", "pickup_location", "drop_location", "fare"];

const createRailwayFare = async (req, res, next) => {
  const sanitizedFields = sanitizeFields(allowedFields, req.body);

  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ data: "Bad Request!" });
    }

    const car = await db.car.findByPk(sanitizedFields.car_id);
    if (!car) {
      return res.status(404).json({ data: "Car Not Found!" });
    }

    const railway = await db.railway_fare.create(sanitizedFields);
    return res.status(200).json({ data: railway });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const updateRailwayFare = async (req, res, next) => {
  const { railwayFareId } = req.query;
  const sanitizedFields = sanitizeFields(allowedFields, req.body);

  try {
    if (
      !railwayFareId ||
      isNaN(railwayFareId) ||
      Object.keys(req.body).length === 0
    ) {
      return res.status(400).json({ data: "Bad Request!" });
    }

    const railway = await db.railway_fare.findByPk(railwayFareId);
    if (!railway) {
      return res.status(404).json({ data: "No such Railway Station found!" });
    }

    await db.railway_fare.update(sanitizedFields, {
      where: { id: railwayFareId },
    });

    return res.status(200).json({ data: "Railway Station Updated!" });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const getRailwayFareById = async (req, res, next) => {
  const { railwayFareId } = req.query;
  if (!railwayFareId) return res.status(400).json({ data: "Bad Request" });

  try {
    const railway = await db.railway_fare.findByPk(railwayFareId);
    if (!railway)
      return res.status(404).json({ data: "Railway Station Not Found" });

    return res.status(200).json({ data: railway });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const getAllRailwayFares = async (req, res, next) => {
  try {
    const railways = await db.railway_fare.findAll();
    if (!railways || railways.length === 0)
      return res.status(404).json({ data: "No railway stations found!" });

    return res.status(200).json({ data: railways });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const deleteRailwayFare = async (req, res, next) => {
  const { railwayFareId } = req.query;
  if (!railwayFareId) return res.status(400).json({ data: "Bad Request" });

  try {
    const railway = await db.railway_fare.findByPk(railwayFareId);
    if (!railway)
      return res.status(404).json({ data: "Railway Station Not Found" });
    await db.railway_fare.destroy({ where: { id: railwayFareId } });
    return res.status(200).json({ data: "Railway Station Deleted!" });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const deleteAllRailways = async (req, res) => {
  try {
    const railways = await db.railway_fare.findAll({ raw: true });
    if (railways.length === 0)
      return res.status(404).json({ data: "No Railway Stations Found!" });
    await db.railway_fare.destroy({ where: {} });
    return res.status(200).json({ data: "All Railway Stations Deleted!" });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = {
  createRailwayFare,
  updateRailwayFare,
  getRailwayFareById,
  getAllRailwayFares,
  deleteRailwayFare,
  deleteAllRailways,
};
