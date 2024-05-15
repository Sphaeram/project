const carPackageController = require("../../controllers/admin/carPackageController");

const router = require("express").Router();

router.post("/assign", carPackageController.assignPackageToCar);

router.delete("/remove", carPackageController.removePackageFromCar);

module.exports = router;
