const router = require("express").Router();
const airportFareRouter = require("./airportFareRoutes");
const railwayFareRouter = require("./railwayFareRoutes");
const packageRouter = require("./packageRoutes");
const carRouter = require("./carRoutes");
const carPackageRouter = require("./carPackageRoutes");
const ziyaratRouter = require("./ziyaratRoutes");
const userRouter = require("./userRoutes");
const couponRouter = require("./couponRoutes");
const reviewRouter = require("./reviewRoutes");
const bookingRouter = require("./bookingRoutes");
const reportRouter = require("./reportRoutes");
const { verifyAdmin } = require("../../middlewares/verify");

router.use("/airport-fares", airportFareRouter);
router.use("/railway-fares", railwayFareRouter);
router.use("/packages", packageRouter);
router.use("/cars", carRouter);
router.use("/car-packages", carPackageRouter);
router.use("/ziyarats", ziyaratRouter);
router.use("/users", userRouter);
router.use("/coupons", couponRouter);
router.use("/reviews", reviewRouter);
router.use("/bookings", verifyAdmin, bookingRouter);
router.use("/reports", reportRouter);

module.exports = router;
