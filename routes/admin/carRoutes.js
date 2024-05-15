const carController = require("../../controllers/admin/carController");
const { upload, handlingMulterError } = require("../../utils/multerUtil");

const router = require("express").Router();

router.post(
  "/create",
  (req, res, next) => {
    req.destination = "car";
    next();
  },
  upload,
  handlingMulterError,
  carController.createCar
);

router.put(
  "/update",
  (req, res, next) => {
    req.destination = "car";
    next();
  },
  upload,
  handlingMulterError,
  carController.updateCarById
);

router.get("/", carController.getAllCars).get("/car", carController.getCarById);

router.delete("/delete", carController.deleteCarById);

module.exports = router;
