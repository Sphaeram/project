const authController = require("../controllers/authController");

const router = require("express").Router();

router.post("/signup", authController.signUp).post("/login", authController.login);

module.exports = router;
