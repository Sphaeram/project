const db = require("../../models");
const { sanitizeFields } = require("../../utils/otherUtils");

const allowedFields = ["name", "details", "price"];

module.exports = {
  createPackage: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    try {
      const package = await db.package.create(sanitizedFields);
      return res.status(200).json({ data: package });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  updatePackageById: async (req, res, next) => {
    const { packageId } = req.query;
    if (!packageId) return res.status(400).json({ data: "Bad Request!" });
    const sanitizedFields = sanitizeFields(allowedFields, req.body);

    try {
      const [rowsAffected] = await db.package.update(sanitizedFields, { where: { id: packageId } });
      if (rowsAffected === 0) return res.status(500).json({ data: "No Package Updated!" });

      return res.status(200).json({ data: "Package Updated!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getAllPackages: async (req, res, next) => {
    try {
      const packages = await db.package.findAll();
      return res.status(200).json({ data: packages });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getPackageById: async (req, res, next) => {
    const { packageId } = req.query;
    if (!packageId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const package = await db.package.findByPk(packageId);
      if (!package) return res.status(404).json({ data: "No Package Found!" });

      return res.status(200).json({ data: package });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deletePackageById: async (req, res, next) => {
    const { packageId } = req.query;
    if (!packageId) return res.status(400).json({ data: "Bad Request!" });
    try {
      await db.package.destroy({ where: { id: packageId } });

      return res.status(200).json({ data: "Package Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
