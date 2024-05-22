const db = require("../../models");
const { sanitizeFields } = require("../../utils/otherUtils");

const allowedFields = ["pickup_point", "drop_point", "car_id", "fair"];

module.exports = {
  createFair: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    try {
      const fair = await db.airport_fair.create(sanitizedFields);
      return res.status(200).json({ data: fair });
    } catch (error) {
      return res.status(500).json({ data: error });
    }
  },

  updateFairById: async (req, res, next) => {
    const { fairId } = req.query;
    if (!fairId) return res.status(400).json({ data: "Bad Request!" });
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    try {
      const [rowsAffected] = await db.airport_fair.update(sanitizedFields, {
        where: { id: fairId },
      });
      if (rowsAffected === 0) return res.status(500).json({ data: "No Fair Updated!" });
      return res.status(200).json({ data: "Fair Updated!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getAllFairs: async (req, res, next) => {
    try {
      const fairs = await db.airport_fair.findAll({
        include: [
          {
            model: db.car,
            attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
          },
        ],
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
      const fair = await db.airport_fair.findByPk(fairId);
      if (!fair) return res.status(404).json({ data: "No Fair Found!" });
      return res.status(200).json({ data: fair });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deleteFairById: async (req, res, next) => {
    const { fairId } = req.query;
    try {
      const fair = await db.airport_fair.findByPk(fairId);
      if (!fair) return res.status(404).json({ data: "No Fair Found!" });
      await db.airport_fair.destroy({ where: { id: fair.id } });
      return res.status(200).json({ data: "Fair Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
