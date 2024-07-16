const router = require("express").Router();
const {
  getAirportFareById,
  getAllAirportFares,
} = require("../../controllers/admin/airportController");

router.get("/", getAllAirportFares).get("/airport-fare", getAirportFareById);

module.exports = router;
