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

router.put("/update", packageController.updatePackageById);

router.get("/", packageController.getAllPackages).get("/package", packageController.getPackageById);

router.delete("/delete", packageController.deletePackageById);

module.exports = router;
