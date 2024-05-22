const db = require("../../models/index");
const { sanitizeFields, deleteLocalFile } = require("../../utils/otherUtils");
const path = require("path");

const allowedFields = ["car_id", "title", "description", "location"];

module.exports = {
  createRailwayStation: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);

    if (
      req.files &&
      req.files["railway_station_image"] &&
      req.files["railway_station_image"].length > 0
    ) {
      sanitizedFields.image = `${req.files["railway_station_image"][0].destination.substring(7)}/${
        req.files["railway_station_image"][0].filename
      }`;
    }
    try {
      const railway_station = await db.railway_station.create(sanitizedFields);
      return res.status(200).json({ data: railway_station });
    } catch (error) {
      //* Deleting the new image
      if (
        req.files &&
        req.files["railway_station_image"] &&
        req.files["railway_station_image"]?.length !== 0
      )
        deleteLocalFile(path.join(__dirname, `../../public/${sanitizedFields.image}`));

      return res.status(500).json({ data: error.message });
    }
  },

  updateRailwayStationById: async (req, res, next) => {
    let image = false;
    const { railwayStationId } = req.query;

    const sanitizedFields = sanitizeFields(allowedFields, req.body);

    if (
      req.files &&
      req.files["railway_station_image"] &&
      req.files["railway_station_image"].length > 0
    ) {
      image = true;
      sanitizedFields.image = `${req.files["railway_station_image"][0].destination.substring(7)}/${
        req.files["railway_station_image"][0].filename
      }`;
    }

    try {
      if (!railwayStationId) throw new Error("Bad Request!");

      const railway_station = await db.railway_station.findByPk(railwayStationId);
      if (!railway_station) throw new Error("No such railway_station found!");

      const [rowsAffected] = await db.railway_station.update(sanitizedFields, {
        where: { id: railwayStationId },
      });
      if (rowsAffected === 0) return res.status(500).json({ data: "Railway Station Not Updated!" });

      if (image) deleteLocalFile(path.join(__dirname, `../../public/${railway_station.image}`));

      return res.status(200).json({ data: "Railway Station Updated!" });
    } catch (error) {
      //* Deleting the new image
      if (
        req.files &&
        req.files["railway_station_image"] &&
        req.files["railway_station_image"]?.length !== 0
      )
        deleteLocalFile(path.join(__dirname, `../../public/${sanitizedFields.image}`));

      return res.status(500).json({ data: error.message });
    }
  },

  getAllRailwayStations: async (req, res, next) => {
    try {
      const railway_stations = await db.railway_station.findAll();
      if (!railway_stations || railway_stations.length === 0)
        return res.status(404).json({ data: "No railway_stations found!" });

      return res.status(200).json({ data: railway_stations });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getRailwayStationById: async (req, res, next) => {
    const { railwayStationId } = req.query;
    if (!railwayStationId) return res.status(400).json({ data: "Bad Request" });

    try {
      const railway_station = await db.railway_station.findByPk(railwayStationId);
      if (!railway_station) return res.status(404).json({ data: "Railway Station Not Found" });

      return res.status(200).json({ data: railway_station });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deleteRailwayStationById: async (req, res, next) => {
    const { railwayStationId } = req.query;
    if (!railwayStationId) return res.status(400).json({ data: "Bad Request" });

    try {
      const railway_station = await db.railway_station.findByPk(railwayStationId);
      if (!railway_station) return res.status(404).json({ data: "Railway Station Not Found" });
      await db.railway_station.destroy({ where: { id: railwayStationId } });
      return res.status(200).json({ data: "Railway Station Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
