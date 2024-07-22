const router = require("express").Router();

const {
  createBooking,
  getAllUserBookings,
  cancelBooking,
} = require("../../controllers/common/bookingController");
const { validateBooking } = require("../../middlewares/validateBooking");
const { verifyLogin, verifyValidityForBooking } = require("../../middlewares/verify");

router.post("/create", verifyLogin, verifyValidityForBooking, validateBooking, createBooking);

router.put("/cancel-booking", verifyLogin, cancelBooking);

router.get("/user-bookings", verifyLogin, getAllUserBookings);

module.exports = router;
