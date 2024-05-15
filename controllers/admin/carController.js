const db = require("../../models");
const { sanitizeFields, deleteLocalFile } = require("../../utils/otherUtils");
const path = require("path");

const allowedFields = [
  "name",
  "number_plate",
  "description",
  "seating_capacity",
  "luggage_number",
  "image",
];

module.exports = {
  createCar: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    if (req.files && req.files["car_image"] && req.files["car_image"].length > 0)
      sanitizedFields.image = `${req.files["car_image"][0].destination.substring(7)}/${
        req.files["car_image"][0].filename
      }`;

    try {
      const car = await db.car.create(sanitizedFields);
      return res.status(200).json({ data: car });
    } catch (error) {
      if (req.files && req.files["car_image"] && req.files["car_image"].length > 0)
        deleteLocalFile(path.join(__dirname, `../../public/${sanitizedFields.image}`));

      return res.status(500).json({ data: error.message });
    }
  },

  updateCarById: async (req, res, next) => {
    const { carId } = req.query;
    let image = false;

    const sanitizedFields = sanitizeFields(allowedFields, req.body);

    if (req.files && req.files["car_image"] && req.files["car_image"].length > 0) {
      image = true;
      sanitizedFields.image = `${req.files["car_image"][0].destination.substring(7)}/${
        req.files["car_image"][0].filename
      }`;
    }

    try {
      if (!carId) throw new Error("Bad Request!");

      const car = await db.car.findByPk(carId);
      if (!car) throw new Error("No Car Found!");

      const [rowsAffected] = await db.car.update(sanitizedFields, { where: { id: car.id } });
      if (rowsAffected === 0) return res.status(404).json({ data: "Car Not Updated!" });

      if (image) deleteLocalFile(path.join(__dirname, `../../public/${car.image}`));

      return res.status(200).json({ data: "Car Updated!" });
    } catch (error) {
      if (req.files && req.files["car_image"] && req.files["car_image"].length > 0)
        deleteLocalFile(path.join(__dirname, `../../public/${sanitizedFields.image}`));
      return res.status(500).json({ data: error.message });
    }
  },

  getAllCars: async (req, res, next) => {
    try {
      const cars = await db.car.findAll();
      if (!cars || cars.length === 0) return res.status(404).json({ data: "No Cars Found!" });

      return res.status(200).json({ data: cars });
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
    const { carId } = req.query;
    if (!carId) return res.status(400).json({ data: "Bad Request!" });

    try {
      await db.car.destroy({ where: { id: carId } });
      return res.status(200).json({ data: "Car Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
