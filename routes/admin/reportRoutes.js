const {
  bookedCarsAnalytics,
  bookingAnalytics,
} = require("../../controllers/admin/reportController");

const router = require("express").Router();

router.get("/booked-cars", bookedCarsAnalytics).get("/bookings", bookingAnalytics);

module.exports = router;
