const userController = require("../../controllers/admin/userController");
const { verifyAdmin, verifyLogin } = require("../../middlewares/verify");

const router = require("express").Router();

router.put("/update", verifyAdmin, userController.updateUserById);

router
  .get("/", userController.getAllUsers)
  .get("/user", userController.getUserById);

router
  .delete("/delete", verifyLogin, userController.deleteUserById)
  .delete("/delete-all", verifyAdmin, userController.deleteAllUsers);

module.exports = router;
