const router = require("express").Router();
const userController = require("../../controllers/admin/userController");

router.get("/", userController.getAllUsers).get("/user", userController.getUserById);

module.exports = router;
