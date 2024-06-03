const router = require("express").Router();

const couponRouter = require("./couponRoutes");
const bookingRouter = require("./bookingRoutes");

router.use("/coupons", couponRouter);
router.use("/bookings", bookingRouter);
router.use("/", (req, res) => res.status(200).send("<center><h1>Welcome!</h1></center>"));

module.exports = router;
