const db = require("../../models");
const {
  sanitizeFields,
  deleteFile,
  convertToJpeg,
} = require("../../utils/otherUtils");

const allowedFields = ["car_id", "name", "details", "price"];

module.exports = {
  createPackage: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    const t = await db.sequelize.transaction();

    try {
      if (req.files["package_image"] && req.files["package_image"].length > 0) {
        sanitizedFields.image = `${req.files[
          "package_image"
        ][0].destination.substring(7)}/${
          req.files["package_image"][0].filename
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

      const sanitizedDetails = JSON.parse(sanitizedFields.details);
      const car = await db.car.findByPk(sanitizedFields.car_id);
      if (!car) {
        if (req.files["package_image"] && req.files["package_image"].length > 0)
          deleteFile(sanitizedFields.image);

        return res
          .status(403)
          .json({ data: "Add a car first before assigning a package!" });
      }

      const newPackage = await db.package.create(
        {
          name: sanitizedFields.name,
          details: JSON.stringify(sanitizedDetails),
          image: sanitizedFields.image,
        },
        { transaction: t }
      );

      await db.car_package.create(
        {
          car_id: car.id,
          package_id: newPackage.id,
          price: sanitizedFields.price,
        },
        { transaction: t }
      );

      await t.commit();

      const package = await db.package.findOne({
        where: { id: newPackage.id },
        include: { model: db.car, through: { attributes: [] } },
      });

      return res.status(200).json({ data: package });
    } catch (error) {
      await t.rollback();
      if (req.files["package_image"] && req.files["package_image"].length > 0)
        deleteFile(sanitizedFields.image);

      return res.status(500).json({ data: error.message });
    }
  },

  addPackage: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    const t = await db.sequelize.transaction();

    try {
      if (Object.keys(req.body).length === 0)
        return res.status(400).json({ data: "Bad Request!" });

      const car = await db.car.findByPk(sanitizedFields.car_id);
      if (!car)
        return res
          .status(403)
          .json({ data: "Add a car first before assigning a package!" });

      const newPackage = await db.package.create(
        {
          name: sanitizedFields.name,
          details: JSON.stringify(sanitizedFields.details),
          image: sanitizedFields.image,
        },
        { transaction: t }
      );

      await db.car_package.create(
        {
          car_id: car.id,
          package_id: newPackage.id,
          price: sanitizedFields.price,
        },
        { transaction: t }
      );

      await t.commit();

      const package = await db.package.findOne({
        where: { id: newPackage.id },
        include: { model: db.car, through: { attributes: [] } },
      });

      return res.status(200).json({ data: package });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ data: error.message });
    }
  },

  updatePackageById: async (req, res, next) => {
    let image = false;
    const { packageId, carId } = req.query;
    const sanitizedFields = sanitizeFields(
      ["number_plate", ...allowedFields],
      req.body
    );
    const t = await db.sequelize.transaction();

    try {
      if (
        req.files &&
        req.files["package_image"] &&
        req.files["package_image"].length > 0
      ) {
        image = true;
        sanitizedFields.image = `${req.files[
          "package_image"
        ][0].destination.substring(7)}/${
          req.files["package_image"][0].filename
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

      if (!packageId || !carId || Object.keys(req.body).length === 0) {
        deleteFile(sanitizedFields.image);
        return res.status(400).json({ data: "Bad Request!" });
      }
      const sanitizedDetails = JSON.parse(sanitizedFields.details);
      const existingCar = await db.car.findOne({ where: { id: carId } });
      if (!existingCar) {
        deleteFile(sanitizedFields.image);
        return res.status(404).json({ data: "Bad Request!" });
      }

      const package = await db.package.findByPk(packageId);
      const car = await db.car.findOne({
        where: { number_plate: sanitizedFields.number_plate },
      });
      if (!package) {
        deleteFile(sanitizedFields.image);
        return res.status(404).json({ data: "Package Not Found!" });
      }

      if (!car) {
        deleteFile(sanitizedFields.image);
        return res.status(404).json({ data: "Car Not Found!" });
      }

      await db.package.update(
        {
          name: sanitizedFields.name,
          details: JSON.stringify(sanitizedDetails),
          image: sanitizedFields.image,
        },
        { where: { id: package.id }, transaction: t }
      );
      await db.car_package.update(
        {
          car_id: car.id,
          package_id: package.id,
          price: sanitizedFields.price,
        },
        { where: { package_id: package.id, car_id: carId }, transaction: t }
      );
      if (image) deleteFile(package.image);

      await t.commit();
      return res.status(200).json({ data: "Package Updated!" });
    } catch (error) {
      await t.rollback();
      if (
        req.files &&
        req.files["package_image"] &&
        req.files["package_image"].length > 0
      )
        deleteFile(sanitizedFields.image);
      return res.status(500).json({ data: error.message });
    }
  },

  getAllPackages: async (req, res, next) => {
    try {
      const packages = await db.package.findAll({
        include: { model: db.car, through: { attributes: ["price"] } },
      });
      return res.status(200).json({ data: packages });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getPackageById: async (req, res, next) => {
    const { packageId } = req.query;
    if (!packageId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const package = await db.package.findOne({
        where: { id: packageId },
        include: { model: db.car, through: { attributes: [] } },
      });
      if (!package) return res.status(404).json({ data: "No Package Found!" });

      return res.status(200).json({ data: package });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getPackagesByCarId: async (req, res) => {
    const { carId } = req.query;
    if (!carId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const packages = await db.car.findAll({
        where: { id: carId },
        include: { model: db.package },
      });
      if (!packages || packages.length === 0)
        return res.status(404).json({ data: "No Packages Found!" });
      return res.status(200).json({ data: packages });
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
      await db.car_package.destroy({ where: { package_id: packageId } });

      return res.status(200).json({ data: "Packages Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deleteAllPackages: async (req, res) => {
    try {
      const packages = await db.package.findAll({ raw: true });
      if (packages.length === 0)
        return res.status(404).json({ data: "No Packages Found!" });
      await db.package.destroy({ where: {}, truncate: true });
      return res.status(200).json({ data: "Packages Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
