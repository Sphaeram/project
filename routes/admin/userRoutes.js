const userController = require("../../controllers/admin/userController");

const router = require("express").Router();

router.get("/", userController.getAllUsers).get("/user", userController.getUserById);

router.delete("/delete", userController.deleteUserById);

module.exports = router;
