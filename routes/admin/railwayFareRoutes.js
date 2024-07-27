const {
  createRailwayFare,
  updateRailwayFare,
  getAllRailwayFares,
  getRailwayFareById,
  deleteRailwayFare,
  deleteAllRailways,
} = require("../../controllers/admin/railwayFareController");
const { verifyAdmin } = require("../../middlewares/verify");

const router = require("express").Router();

router.post("/create", verifyAdmin, createRailwayFare);

router.put("/update", verifyAdmin, updateRailwayFare);

router.get("/", getAllRailwayFares).get("/railway-fare", getRailwayFareById);

router
  .delete("/delete", verifyAdmin, deleteRailwayFare)
  .delete("/delete-all", verifyAdmin, deleteAllRailways);

module.exports = router;
