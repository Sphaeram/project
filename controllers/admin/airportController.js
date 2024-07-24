const db = require("../../models/index");
const {
  sanitizeFields,
  deleteFile,
  convertToJpeg,
} = require("../../utils/otherUtils");

const allowedFields = ["car_id", "pickup_location", "drop_location", "fare"];

const createAirportFare = async (req, res, next) => {
  const sanitizedFields = sanitizeFields(allowedFields, req.body);

  try {
    if (
      req.files &&
      req.files["airport_image"] &&
      req.files["airport_image"].length > 0
    ) {
      sanitizedFields.image = `${req.files[
        "airport_image"
      ][0].destination.substring(7)}/${req.files["airport_image"][0].filename}`;
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

    const airport = await db.airport_fare.create(sanitizedFields);
    return res.status(200).json({ data: airport });
  } catch (error) {
    if (
      req.files &&
      req.files["airport_image"] &&
      req.files["airport_image"]?.length !== 0
    )
      deleteFile(sanitizedFields.image);

    return res.status(500).json({ data: error.message });
  }
};

const updateAirportFare = async (req, res, next) => {
  let image = false;
  const { airportFareId } = req.query;
  const sanitizedFields = sanitizeFields(allowedFields, req.body);

  try {
    if (
      req.files &&
      req.files["airport_image"] &&
      req.files["airport_image"].length > 0
    ) {
      image = true;
      sanitizedFields.image = `${req.files[
        "airport_image"
      ][0].destination.substring(7)}/${req.files["airport_image"][0].filename}`;
      // If the file is in binary (sent from a flutter web application)
      if (!sanitizedFields.image?.split(".")[1]) {
        const format = await convertToJpeg(
          `${sanitizedFields.image}`,
          `${sanitizedFields.image}.jpeg`
        );
        sanitizedFields.image = sanitizedFields.image?.concat(".", format);
      }
    }
    if (
      !airportFareId ||
      isNaN(airportFareId) ||
      Object.keys(req.body).length === 0
    ) {
      deleteFile(sanitizedFields.image);
      return res.status(400).json({ data: "Bad Request!" });
    }

    const airport = await db.airport_fare.findByPk(airportFareId);
    if (!airport) {
      deleteFile(sanitizedFields.image);
      return res.status(404).json({ data: "No such airport found!" });
    }

    await db.airport_fare.update(sanitizedFields, {
      where: { id: airportFareId },
    });

    if (image) deleteFile(airport.image);

    return res.status(200).json({ data: "Airport Updated!" });
  } catch (error) {
    if (
      req.files &&
      req.files["airport_image"] &&
      req.files["airport_image"]?.length !== 0
    )
      deleteFile(sanitizedFields.image);

    return res.status(500).json({ data: error.message });
  }
};

const getAirportFareById = async (req, res, next) => {
  const { airportFareId } = req.query;
  if (!airportFareId) return res.status(400).json({ data: "Bad Request" });

  try {
    const airport = await db.airport_fare.findByPk(airportFareId);
    if (!airport) return res.status(404).json({ data: "Airport Not Found" });

    return res.status(200).json({ data: airport });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const getAllAirportFares = async (req, res, next) => {
  try {
    const airports = await db.airport_fare.findAll();
    if (!airports || airports.length === 0)
      return res.status(404).json({ data: "No airports found!" });

    return res.status(200).json({ data: airports });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const deleteAirportFare = async (req, res, next) => {
  const { airportFareId } = req.query;
  if (!airportFareId) return res.status(400).json({ data: "Bad Request" });

  try {
    const airport = await db.airport_fare.findByPk(airportFareId);
    if (!airport) return res.status(404).json({ data: "Airport Not Found" });
    await db.airport_fare.destroy({ where: { id: airportFareId } });
    return res.status(200).json({ data: "Airport Deleted!" });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const deleteAllAirports = async (req, res) => {
  try {
    const airports = await db.airport_fare.findAll();
    if (!airports || airports.length === 0)
      return res.status(404).json({ data: "No airports found!" });
    await db.airport_fare.destroy({ where: {} });
    return res.status(200).json({ data: "All airports deleted!" });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = {
  createAirportFare,
  updateAirportFare,
  getAirportFareById,
  getAllAirportFares,
  deleteAirportFare,
  deleteAllAirports,
};
