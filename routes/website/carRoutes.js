const router = require("express").Router();
const carController = require("../../controllers/admin/carController");

router.get("/", carController.getAllCars).get("/car", carController.getCarById);

module.exports = router;
