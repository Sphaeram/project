const userController = require("../../controllers/admin/userController");
const { verifyAdmin } = require("../../middlewares/verify");

const router = require("express").Router();

router.get("/", userController.getAllUsers).get("/user", userController.getUserById);

router.delete("/delete", verifyAdmin, userController.deleteUserById);

module.exports = router;
