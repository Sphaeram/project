const router = require("express").Router();

const { createBooking } = require("../../controllers/common/bookingController");
const { verifyLogin } = require("../../middlewares/verify");

router.post("/create", verifyLogin, createBooking);

module.exports = router;
