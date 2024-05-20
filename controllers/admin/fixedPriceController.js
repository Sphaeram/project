const db = require("../../models");
const { sanitizeFields } = require("../../utils/otherUtils");

const allowedFields = [""];

module.exports = {
  createFair: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    try {
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  updateFairById: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    try {
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getAllFairs: async (req, res, next) => {
    try {
      const fairs = await db.fixed_price.findAll();
      if (!fairs || fairs.length === 0) return res.status(404).json({ data: "No Fairs Found!" });
      return res.status(200).json({ data: fairs });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getAllAirportFairs: async (req, res, next) => {
    try {
      const fairs = await db.fixed_price.findAll({
        include: [],
      });
      if (!fairs || fairs.length === 0) return res.status(404).json({ data: "No Fairs Found!" });
      return res.status(200).json({ data: fairs });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getAllTrainFairs: async (req, res, next) => {
    try {
      const fairs = await db.fixed_price.findAll({
        include: [],
      });
      if (!fairs || fairs.length === 0) return res.status(404).json({ data: "No Fairs Found!" });
      return res.status(200).json({ data: fairs });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getFairById: async (req, res, next) => {
    const { fairId } = req.query;
    try {
      const fair = await db.fixed_price.findByPk(fairId);
      if (!fair) return res.status(404).json({ data: "No Fair Found!" });
      return res.status(200).json({ data: fair });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deleteFairById: async (req, res, next) => {
    const { fairId } = req.query;
    try {
      const fair = await db.fixed_price.findByPk(fairId);
      if (!fair) return res.status(404).json({ data: "No Fair Found!" });
      await db.fixed_price.destroy({ where: { id: fair.id } });
      return res.status(200).json({ data: "Fair Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
