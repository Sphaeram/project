const packageController = require("../../controllers/admin/packageController");
const { handlingMulterError, upload } = require("../../utils/multerUtil");

const router = require("express").Router();

router.post(
  "/create",
  (req, res, next) => {
    req.destination = "package";
    next();
  },
  upload,
  handlingMulterError,
  packageController.createPackage
);

router.put(
  "/update",
  (req, res, next) => {
    req.destination = "package";
    next();
  },
  upload,
  handlingMulterError,
  packageController.updatePackageById
);

router
  .get("/", packageController.getAllPackages)
  .get("/package", packageController.getPackageById)
  .get("/car-packages", packageController.getPackagesByCarId);

router.delete("/delete", packageController.deletePackageById);

module.exports = router;
