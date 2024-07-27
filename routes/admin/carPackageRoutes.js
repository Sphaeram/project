/* Not Being Used Currently! */

const carPackageController = require("../../controllers/admin/carPackageController");
const { verifyAdmin } = require("../../middlewares/verify");

const router = require("express").Router();

router.post("/assign", verifyAdmin, carPackageController.assignPackageToCar);

router.delete(
  "/remove",
  verifyAdmin,
  carPackageController.removePackageFromCar
);

module.exports = router;
