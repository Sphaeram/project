const db = require("../../models/index");
const { sanitizeFields, deleteLocalFile } = require("../../utils/otherUtils");
const path = require("path");

const allowedFields = ["car_id", "title", "description", "location"];

const createAirport = async (req, res, next) => {
  const sanitizedFields = sanitizeFields(allowedFields, req.body);

  if (req.files && req.files["airport_image"] && req.files["airport_image"].length > 0) {
    sanitizedFields.image = `${req.files["airport_image"][0].destination.substring(7)}/${
      req.files["airport_image"][0].filename
    }`;
  }
  try {
    const airport = await db.airport.create(sanitizedFields);
    return res.status(200).json({ data: airport });
  } catch (error) {
    //* Deleting the new image
    if (req.files && req.files["airport_image"] && req.files["airport_image"]?.length !== 0)
      deleteLocalFile(path.join(__dirname, `../../public/${sanitizedFields.image}`));

    return res.status(500).json({ data: error.message });
  }
};

const updateAirport = async (req, res, next) => {
  let image = false;
  const { airportId } = req.query;

  const sanitizedFields = sanitizeFields(allowedFields, req.body);

  if (req.files && req.files["airport_image"] && req.files["airport_image"].length > 0) {
    image = true;
    sanitizedFields.image = `${req.files["airport_image"][0].destination.substring(7)}/${
      req.files["airport_image"][0].filename
    }`;
  }

  try {
    if (!airportId) throw new Error("Bad Request!");

    const airport = await db.airport.findByPk(airportId);
    if (!airport) throw new Error("No such airport found!");

    const [rowsAffected] = await db.airport.update(sanitizedFields, { where: { id: airportId } });
    if (rowsAffected === 0) return res.status(500).json({ data: "Airport Not Updated!" });

    if (image) deleteLocalFile(path.join(__dirname, `../../public/${airport.image}`));

    return res.status(200).json({ data: "Airport Updated!" });
  } catch (error) {
    //* Deleting the new image
    if (req.files && req.files["airport_image"] && req.files["airport_image"]?.length !== 0)
      deleteLocalFile(path.join(__dirname, `../../public/${sanitizedFields.image}`));

    return res.status(500).json({ data: error.message });
  }
};

const getAirportById = async (req, res, next) => {
  const { airportId } = req.query;
  if (!airportId) return res.status(400).json({ data: "Bad Request" });

  try {
    const airport = await db.airport.findByPk(airportId);
    if (!airport) return res.status(404).json({ data: "Airport Not Found" });

    return res.status(200).json({ data: airport });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const getAllAirports = async (req, res, next) => {
  try {
    const airports = await db.airport.findAll();
    if (!airports || airports.length === 0)
      return res.status(404).json({ data: "No airports found!" });

    return res.status(200).json({ data: airports });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const deleteAirport = async (req, res, next) => {
  const { airportId } = req.query;
  if (!airportId) return res.status(400).json({ data: "Bad Request" });

  try {
    const airport = await db.airport.findByPk(airportId);
    if (!airport) return res.status(404).json({ data: "Airport Not Found" });
    await db.airport.destroy({ where: { id: airportId } });
    return res.status(200).json({ data: "Airport Deleted!" });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = {
  createAirport,
  updateAirport,
  getAirportById,
  getAllAirports,
  deleteAirport,
};
