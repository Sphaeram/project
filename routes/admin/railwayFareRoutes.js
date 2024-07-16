const {
  createRailwayFare,
  updateRailwayFare,
  getAllRailwayFares,
  getRailwayFareById,
  deleteRailwayFare,
} = require("../../controllers/admin/railwayFareController");
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
  createRailwayFare
);

router.put(
  "/update",
  (req, res, next) => {
    req.destination = "railway_station";
    next();
  },
  upload,
  handlingMulterError,
  updateRailwayFare
);

router.get("/", getAllRailwayFares).get("/railway-fare", getRailwayFareById);

router.delete("/delete", deleteRailwayFare);

module.exports = router;
