const carController = require("../../controllers/admin/carController");
const { upload, handlingMulterError } = require("../../utils/multerUtil");

const { verifyAdmin } = require("../../middlewares/verify");
const router = require("express").Router();

router.post(
  "/create",
  verifyAdmin,
  (req, res, next) => {
    req.destination = "car";
    next();
  },
  upload,
  handlingMulterError,
  carController.createCar
);

router
  .put(
    "/update",
    verifyAdmin,
    (req, res, next) => {
      req.destination = "car";
      next();
    },
    upload,
    handlingMulterError,
    carController.updateCarById
  )
  .put("/update-status", verifyAdmin, carController.updateCarBookedStatus);

router.get("/", carController.getAllCars).get("/car", carController.getCarById);

router.delete("/delete", verifyAdmin, carController.deleteCarById);

module.exports = router;
