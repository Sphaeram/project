const router = require("express").Router();
const airportFareRouter = require("./airportFareRoutes");
const railwayFareRouter = require("./railwayFareRoutes");
const packageRouter = require("./packageRoutes");
const carRouter = require("./carRoutes");
const categoryRouter = require("./categoryRoutes");
const subCategoryRouter = require("./subCategoryRoutes");
const userRouter = require("./userRoutes");
const reviewRouter = require("./reviewRoutes");
const couponRouter = require("./couponRoutes");
const bookingRouter = require("./bookingRoutes");

router.use("/coupons", couponRouter);
router.use("/bookings", bookingRouter);
router.use("/airport-fares", airportFareRouter);
router.use("/railway-fares", railwayFareRouter);
router.use("/packages", packageRouter);
router.use("/cars", carRouter);
router.use("/categories", categoryRouter);
router.use("/sub-categories", subCategoryRouter);
router.use("/users", userRouter);
router.use("/reviews", reviewRouter);
router.get("/", (req, res) => res.status(200).send("<center><h1>Welcome!</h1></center>"));

module.exports = router;
