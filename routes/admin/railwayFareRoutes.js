const {
  createRailwayFare,
  updateRailwayFare,
  getAllRailwayFares,
  getRailwayFareById,
  deleteRailwayFare,
  deleteAllRailways,
} = require("../../controllers/admin/railwayFareController");
const { verifyAdmin } = require("../../middlewares/verify");
const { upload, handlingMulterError } = require("../../utils/multerUtil");

const router = require("express").Router();

router.post(
  "/create",
  verifyAdmin,
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
  verifyAdmin,
  (req, res, next) => {
    req.destination = "railway_station";
    next();
  },
  upload,
  handlingMulterError,
  updateRailwayFare
);

router.get("/", getAllRailwayFares).get("/railway-fare", getRailwayFareById);

router
  .delete("/delete", verifyAdmin, deleteRailwayFare)
  .delete("/delete-all", verifyAdmin, deleteAllRailways);

module.exports = router;
