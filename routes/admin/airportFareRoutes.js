const {
  createAirportFare,
  updateAirportFare,
  deleteAirportFare,
  getAirportFareById,
  getAllAirportFares,
  deleteAllAirports,
} = require("../../controllers/admin/airportController");
const { verifyAdmin } = require("../../middlewares/verify");

const router = require("express").Router();

router.post("/create", verifyAdmin, createAirportFare);

router.put("/update", verifyAdmin, updateAirportFare);

router.get("/", getAllAirportFares).get("/airport-fare", getAirportFareById);

router
  .delete("/delete", verifyAdmin, deleteAirportFare)
  .delete("/delete-all", verifyAdmin, deleteAllAirports);

module.exports = router;
