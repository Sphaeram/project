const router = require("express").Router();
const railwayStationController = require("../../controllers/admin/railwayStationController");

router
  .get("/", railwayStationController.getAllRailwayStations)
  .get("/railway-station", railwayStationController.getRailwayStationById);

module.exports = router;
