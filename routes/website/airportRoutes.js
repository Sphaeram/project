const router = require("express").Router();
const { getAllAirports, getAirportById } = require("../../controllers/admin/airportController");

router.get("/", getAllAirports).get("/airport", getAirportById);

module.exports = router;
