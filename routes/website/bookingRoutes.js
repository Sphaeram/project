const router = require("express").Router();

const bookingController = require("../../controllers/website/bookingController");
const billCalculation = require("../../middlewares/billCalculation");
const { verifyLogin } = require("../../middlewares/verify");

router.post("/create", verifyLogin, billCalculation, bookingController.createBooking);

module.exports = router;
