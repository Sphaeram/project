const railwayStationController = require("../../controllers/admin/railwayStationController");
const { upload, handlingMulterError } = require("../../utils/multerUtil");

const router = require("express").Router();

router.post(
  "/create",
  (req, res, next) => {
    req.destination = "railway_station";
    next();
  },
  upload,
  handlingMulterError,
  railwayStationController.createRailwayStation
);

router.put(
  "/update",
  (req, res, next) => {
    req.destination = "railway_station";
    next();
  },
  upload,
  handlingMulterError,
  railwayStationController.updateRailwayStationById
);

router
  .get("/", railwayStationController.getAllRailwayStations)
  .get("/railway-station", railwayStationController.getRailwayStationById);

router.delete("/delete", railwayStationController.deleteRailwayStationById);

module.exports = router;
