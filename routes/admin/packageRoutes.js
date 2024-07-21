const packageController = require("../../controllers/admin/packageController");
const { verifyAdmin } = require("../../middlewares/verify");
const { handlingMulterError, upload } = require("../../utils/multerUtil");

const router = require("express").Router();

router.post(
  "/create",
  verifyAdmin,
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
  verifyAdmin,
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

router.delete("/delete", verifyAdmin, packageController.deletePackageById);

module.exports = router;
