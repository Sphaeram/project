const packageController = require("../../controllers/admin/packageController");

const router = require("express").Router();

router.post("/create", packageController.createPackage);

router.put("/update", packageController.updatePackageById);

router.get("/", packageController.getAllPackages).get("/package", packageController.getPackageById);

router.delete("/delete", packageController.deletePackageById);

module.exports = router;
