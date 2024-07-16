const db = require("../../models");
const { sanitizeFields, deleteLocalFile, deleteFile } = require("../../utils/otherUtils");
const path = require("path");

// const allowedFields = ["name", "details", "price"];
const allowedFields = [
  "name",
  "details",
  "price",
  "car_type",
  "driver_name",
  "seating_capacity",
  "luggage_capacity",
];

module.exports = {
  createPackage: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    if (req.files && req.files["package_image"] && req.files["package_image"].length > 0)
      sanitizedFields.image = `${req.files["package_image"][0].destination.substring(7)}/${
        req.files["package_image"][0].filename
      }`;

    // if (sanitizedFields.details?.length > 0)
    //   sanitizedFields.details = sanitizedFields.details.join("***bullet***");
    // else sanitizedFields.details = "";

    try {
      const car = await db.car.findOne({
        where: { type: sanitizedFields.car_type, driver_name: sanitizedFields.driver_name },
      });
      if (!car) {
        if (req.files && req.files["package_image"] && req.files["package_image"].length > 0)
          deleteFile(sanitizedFields.image);

        return res.status(403).json({ data: "Add a car first before assigning a package!" });
      }

      const foundPackage = await db.package.findOne({
        where: { name: sanitizedFields.name, price: sanitizedFields.price },
        raw: true,
      });
      console.log(foundPackage);
      if (foundPackage) {
        if (req.files && req.files["package_image"] && req.files["package_image"].length > 0)
          deleteFile(sanitizedFields.image);

        const packageAssignedToCar = await db.car_package.findOne({
          where: { car_id: car.id, package_id: foundPackage.id },
        });
        if (packageAssignedToCar)
          return res.status(409).json({ data: "Package already assigned to this car!" });
        else {
          await db.car_package.create({ car_id: car.id, package_id: foundPackage.id });
          const package = await db.package.findOne({
            where: { id: foundPackage.id },
            include: { model: db.car, through: { attributes: [] } },
          });
          return res.status(200).json({ data: package });
        }
      } else {
        const newPackage = await db.package.create({
          name: sanitizedFields.name,
          price: sanitizedFields.price,
          details: sanitizedFields.details,
        });

        await db.car_package.create({ car_id: car.id, package_id: newPackage.id });

        const package = await db.package.findOne({
          where: { id: newPackage.id },
          include: { model: db.car, through: { attributes: [] } },
        });

        return res.status(200).json({ data: package });
      }
    } catch (error) {
      if (req.files && req.files["package_image"] && req.files["package_image"].length > 0)
        deleteFile(sanitizedFields.image);

      return res.status(500).json({ data: error.message });
    }
  },

  //todo: image
  updatePackageById: async (req, res, next) => {
    const { packageId } = req.query;
    if (!packageId) return res.status(400).json({ data: "Bad Request!" });
    if (req.files && req.files["package_image"] && req.files["package_image"].length > 0)
      sanitizedFields.image = `${req.files["package_image"][0].destination.substring(7)}/${
        req.files["package_image"][0].filename
      }`;

    const sanitizedFields = sanitizeFields(allowedFields, req.body);

    try {
      const package = await db.package.findByPk(packageId);
      if (!package)
        return res.status(404).json({ data: "Package Not Found! Please add a new package first!" });

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
      const package = await db.package.findByPk(packageId);
      if (!package) return res.status(404).json({ data: "No Package Found!" });
      await db.package.destroy({ where: { id: packageId } });

      return res.status(200).json({ data: "Package Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
