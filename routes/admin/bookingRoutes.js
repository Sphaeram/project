const bookingController = require("../../controllers/admin/bookingController");
const { createBooking } = require("../../controllers/common/bookingController");
const { validateBooking } = require("../../middlewares/validateBooking");
const { verifyLogin, verifyValidityForBooking } = require("../../middlewares/verify");

const router = require("express").Router();

router.post("/create", verifyLogin, verifyValidityForBooking, validateBooking, createBooking);

router.put("/update", bookingController.updateBookingStatus);

router.get("/", bookingController.getAllBookings).get("/booking", bookingController.getBookingById);

router.delete("/delete", bookingController.deleteBookingById);

module.exports = router;
