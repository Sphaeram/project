const router = require("express").Router();
const packageController = require("../../controllers/admin/packageController");

router
  .get("/", packageController.getAllPackages)
  .get("/package", packageController.getPackageById)
  .get("/car-packages", packageController.getPackagesByCarId);

module.exports = router;
