const { bookedCarsAnalytics } = require("../../controllers/admin/reportController");

const router = require("express").Router();

router.get("/booked-cars", bookedCarsAnalytics);

module.exports = router;
