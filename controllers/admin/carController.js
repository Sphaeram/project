const db = require("../../models");
const {
  sanitizeFields,
  deleteFile,
  convertToJpeg,
} = require("../../utils/otherUtils");
const path = require("path");

const allowedFields = [
  "type",
  "driver_name",
  "model",
  "number_plate",
  "seating_capacity",
  "luggage_capacity",
  "image",
  "saved_qty",
];

module.exports = {
  createCar: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);

    try {
      if (
        req.files &&
        req.files["car_image"] &&
        req.files["car_image"].length > 0
      ) {
        sanitizedFields.image = `${req.files[
          "car_image"
        ][0].destination.substring(7)}/${req.files["car_image"][0].filename}`;
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

      sanitizedFields.qty = sanitizedFields.saved_qty;
      const car = await db.car.create(sanitizedFields);
      return res.status(200).json({ data: car });
    } catch (error) {
      if (
        req.files &&
        req.files["car_image"] &&
        req.files["car_image"].length > 0
      )
        deleteFile(sanitizedFields.image);

      return res.status(500).json({ data: error.message });
    }
  },

  updateCarById: async (req, res, next) => {
    let image = false;
    const { carId } = req.query;
    const sanitizedFields = sanitizeFields(allowedFields, req.body);

    try {
      if (
        req.files &&
        req.files["car_image"] &&
        req.files["car_image"].length > 0
      ) {
        image = true;
        sanitizedFields.image = `${req.files[
          "car_image"
        ][0].destination.substring(7)}/${req.files["car_image"][0].filename}`;
        if (!sanitizedFields.image?.split(".")[1]) {
          const format = await convertToJpeg(
            `${sanitizedFields.image}`,
            `${sanitizedFields.image}.jpeg`
          );
          sanitizedFields.image = sanitizedFields.image?.concat(".", format);
        }
      }
      if (!carId || isNaN(carId) || Object.keys(req.body).length === 0) {
        deleteFile(sanitizedFields.image);
        return res.status(400).json({ data: "Bad Request!" });
      }

      const car = await db.car.findByPk(carId);
      if (!car) {
        deleteFile(sanitizedFields.image);
        return res.status(404).json({ data: "Car Not Found!" });
      }

      if (
        sanitizedFields.saved_qty &&
        sanitizedFields.saved_qty < car.saved_qty
      )
        return res
          .status(403)
          .json({ data: `${car.saved_qty - car.qty} cars are booked!` });

      if (
        sanitizedFields.saved_qty &&
        sanitizedFields.saved_qty > car.saved_qty
      ) {
        sanitizedFields.qty = car.qty + (sanitizedFields.saved_qty - car.qty);
      }

      sanitizedFields.qty = await db.car.update(sanitizedFields, {
        where: { id: car.id },
      });

      if (image) deleteFile(car.image);

      return res.status(200).json({ data: "Car Updated!" });
    } catch (error) {
      if (
        req.files &&
        req.files["car_image"] &&
        req.files["car_image"].length > 0
      )
        deleteFile(sanitizedFields.image);
      return res.status(500).json({ data: error.message });
    }
  },

  updateCarBookedStatus: async (req, res) => {
    const { carId } = req.query;
    const { status } = req.body;
    if (!carId || isNaN(carId) || (status !== true && status !== false))
      return res.status(400).json({ data: "Bad Request!" });
    try {
      const car = await db.car.findByPk(carId);
      if (!car) return res.status(404).json({ data: "Car not found!" });
      if (status) {
        await db.car.update(
          { booked: status, qty: 0 },
          { where: { id: carId } }
        );
      } else {
        await db.car.update(
          { booked: status, qty: car.saved_qty },
          { where: { id: carId } }
        );
      }

      return res.status(200).json({ data: "status updated!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getAllCars: async (req, res, next) => {
    try {
      const cars = await db.car.findAll();
      if (!cars || cars.length === 0)
        return res.status(404).json({ data: "No Cars Found!" });

      return res.status(200).json({ data: cars?.reverse() });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getCarById: async (req, res, next) => {
    const { carId } = req.query;
    if (!carId) return res.status(400).json({ data: "Bad Request!" });

    try {
      const car = await db.car.findByPk(carId);
      if (!car) return res.status(404).json({ data: "No Car Found!" });

      return res.status(200).json({ data: car });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deleteCarById: async (req, res, next) => {
    let packagesCount = 0;
    const { carId } = req.query;
    if (!carId) return res.status(400).json({ data: "Bad Request!" });

    try {
      const car = await db.car.findByPk(carId, { raw: true });
      if (!car) return res.status(404).json({ data: "No Car Found!" });
      if (car.booked || car.qty > 0)
        return res
          .status(403)
          .json({ data: "Car is booked and can't be deleted!" });

      const packages = await db.package.findAll({
        attributes: [],
        include: [
          {
            model: db.car,
            through: {
              attributes: ["car_id", "package_id"],
              where: { car_id: carId },
            },
          },
        ],
      });
      packages.forEach((package) => {
        if (package.cars.length > 0) packagesCount++;
      });
      if (packagesCount > 0)
        return res.status(403).json({
          data: `Can't delete! This car is assigned to ${packagesCount} packages.`,
        });

      const ziyarats = await db.category.findAll({
        where: { car_id: carId },
        raw: true,
      });
      if (ziyarats.length > 0)
        return res.status(403).json({
          data: `Can't delete! This car is assigned to ${ziyarats.length} ziyarats.`,
        });

      const airports = await db.airport_fare.findAll({
        where: { car_id: carId },
        raw: true,
      });
      if (airports.length > 0)
        return res.status(403).json({
          data: `Can't delete! This car is assigned to ${airports.length} ziyarats.`,
        });

      const railways = await db.railway_fare.findAll({
        where: { car_id: carId },
        raw: true,
      });
      if (railways.length > 0)
        return res.status(403).json({
          data: `Can't delete! This car is assigned to ${railways.length} ziyarats.`,
        });

      await db.car.destroy({ where: { id: carId } });
      await db.car_package.destroy({ where: { car_id: carId } });

      return res.status(200).json({ data: "Car Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
