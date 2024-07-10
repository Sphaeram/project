const bookingController = require("../../controllers/admin/bookingController");

const router = require("express").Router();

router.get("/", bookingController.getAllBookings).get("/booking", bookingController.getBookingById);

router.delete("/delete", bookingController.deleteBookingById);

module.exports = router;
