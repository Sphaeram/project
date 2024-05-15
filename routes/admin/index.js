const router = require("express").Router();
const airportRouter = require("./airportRoutes");
const hotelRouter = require("./hotelRoutes");
const railwayStationRouter = require("./railwayStationRoutes");
const packageRouter = require("./packageRoutes");
const carRouter = require("./carRoutes");
const carPackageRouter = require("./carPackageRoutes");

router.use("/airports", airportRouter);
router.use("/hotels", hotelRouter);
router.use("/railway-stations", railwayStationRouter);
router.use("/packages", packageRouter);
router.use("/cars", carRouter);
router.use("/car-packages", carPackageRouter);

module.exports = router;
