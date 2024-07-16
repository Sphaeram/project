const {
  getAllRailwayFares,
  getRailwayFareById,
} = require("../../controllers/admin/railwayFareController");

const router = require("express").Router();

router.get("/", getAllRailwayFares).get("/railway-fare", getRailwayFareById);

module.exports = router;
