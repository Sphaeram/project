const db = require("../../models/index");
const { sanitizeFields, deleteFile, convertToJpeg } = require("../../utils/otherUtils");

const allowedFields = ["car_id", "pickup_location", "drop_location", "fare"];

const createRailwayFare = async (req, res, next) => {
  const sanitizedFields = sanitizeFields(allowedFields, req.body);

  try {
    if (req.files["railway_station_image"] && req.files["railway_station_image"].length > 0) {
      sanitizedFields.image = `${req.files["railway_station_image"][0].destination.substring(7)}/${
        req.files["railway_station_image"][0].filename
      }`;
      // If the file is in binary (sent from a flutter web application)
      if (!sanitizedFields.image?.split(".")[1]) {
        const format = await convertToJpeg(
          `${sanitizedFields.image}`,
          `${sanitizedFields.image}.jpeg`
        );
        sanitizedFields.image = sanitizedFields.image?.concat(".", format);
      }
    }
    if (Object.keys(req.body).length === 0) {
      deleteFile(sanitizedFields.image);
      return res.status(400).json({ data: "Bad Request!" });
    }

    const car = await db.car.findByPk(sanitizedFields.car_id);
    if (!car) {
      deleteFile(sanitizedFields.image);
      return res.status(404).json({ data: "Car Not Found!" });
    }

    const railway = await db.railway_fare.create(sanitizedFields);
    return res.status(200).json({ data: railway });
  } catch (error) {
    if (req.files["railway_station_image"] && req.files["railway_station_image"]?.length !== 0)
      deleteFile(sanitizedFields.image);

    return res.status(500).json({ data: error.message });
  }
};

const updateRailwayFare = async (req, res, next) => {
  let image = false;
  const { railwayFareId } = req.query;
  const sanitizedFields = sanitizeFields(allowedFields, req.body);

  try {
    if (req.files["railway_station_image"] && req.files["railway_station_image"].length > 0) {
      image = true;
      sanitizedFields.image = `${req.files["railway_station_image"][0].destination.substring(7)}/${
        req.files["railway_station_image"][0].filename
      }`;
      // If the file is in binary (sent from a flutter web application)
      if (!sanitizedFields.image?.split(".")[1]) {
        const format = await convertToJpeg(
          `${sanitizedFields.image}`,
          `${sanitizedFields.image}.jpeg`
        );
        sanitizedFields.image = sanitizedFields.image?.concat(".", format);
      }
    }

    if (!railwayFareId || isNaN(railwayFareId) || Object.keys(req.body).length === 0) {
      deleteFile(sanitizedFields.image);
      return res.status(400).json({ data: "Bad Request!" });
    }

    const railway = await db.railway_fare.findByPk(railwayFareId);
    if (!railway) {
      deleteFile(sanitizedFields.image);
      return res.status(404).json({ data: "No such Railway Station found!" });
    }

    await db.railway_fare.update(sanitizedFields, {
      where: { id: railwayFareId },
    });

    if (image) deleteFile(railway.image);

    return res.status(200).json({ data: "Railway Station Updated!" });
  } catch (error) {
    if (req.files["railway_station_image"] && req.files["railway_station_image"]?.length !== 0)
      deleteFile(sanitizedFields.image);

    return res.status(500).json({ data: error.message });
  }
};

const getRailwayFareById = async (req, res, next) => {
  const { railwayFareId } = req.query;
  if (!railwayFareId) return res.status(400).json({ data: "Bad Request" });

  try {
    const railway = await db.railway_fare.findByPk(railwayFareId);
    if (!railway) return res.status(404).json({ data: "Railway Station Not Found" });

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
    if (!railway) return res.status(404).json({ data: "Railway Station Not Found" });
    await db.railway_fare.destroy({ where: { id: railwayFareId } });
    return res.status(200).json({ data: "Railway Station Deleted!" });
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
};
