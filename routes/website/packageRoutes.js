const router = require("express").Router();
const packageController = require("../../controllers/admin/packageController");

router.get("/", packageController.getAllPackages).get("/package", packageController.getPackageById);

module.exports = router;
