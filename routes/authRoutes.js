const authController = require("../controllers/authController");

const router = require("express").Router();

router
  .post("/signup", authController.signUp)
  .post("/login", authController.login)
  .post("/reset-password", authController.resetPassword);

module.exports = router;
