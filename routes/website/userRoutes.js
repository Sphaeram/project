const router = require("express").Router();
const userController = require("../../controllers/admin/userController");
const { changePassword } = require("../../controllers/authController");
const { updateUser } = require("../../controllers/common/userController");
const { verifyLogin } = require("../../middlewares/verify");

router
  .put("/update", verifyLogin, updateUser)
  .put("/update-password", verifyLogin, changePassword);

router
  .get("/", userController.getAllUsers)
  .get("/user", userController.getUserById);

router.delete("/delete", verifyLogin, userController.deleteUserById);

module.exports = router;
