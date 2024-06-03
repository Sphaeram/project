const router = require("express").Router();
const airportRouter = require("./airportRoutes");
const hotelRouter = require("./hotelRoutes");
const railwayStationRouter = require("./railwayStationRoutes");
const packageRouter = require("./packageRoutes");
const carRouter = require("./carRoutes");
const carPackageRouter = require("./carPackageRoutes");
const categoryRouter = require("./categoryRoutes");
const subCategoryRouter = require("./subCategoryRoutes");
const userRouter = require("./userRoutes");
const couponRouter = require("./couponRoutes");
const reviewRouter = require("./reviewRoutes");
const fareRouter = require("./fareRoutes");

router.use("/airports", airportRouter);
router.use("/hotels", hotelRouter);
router.use("/railway-stations", railwayStationRouter);
router.use("/packages", packageRouter);
router.use("/cars", carRouter);
router.use("/car-packages", carPackageRouter);
router.use("/categories", categoryRouter);
router.use("/sub-categories", subCategoryRouter);
router.use("/users", userRouter);
router.use("/coupons", couponRouter);
router.use("/reviews", reviewRouter);
router.use("/fares", fareRouter);

module.exports = router;
