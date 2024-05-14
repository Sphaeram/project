const router = require("express").Router();
const airportRouter = require("./airportRoutes");
const hotelRouter = require("./hotelRoutes");
const railwayStationRouter = require("./railwayStationRoutes");

router.use("/airports", airportRouter);
router.use("/hotels", hotelRouter);
router.use("/railway-stations", railwayStationRouter);

module.exports = router;
