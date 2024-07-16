const {
  createAirportFare,
  updateAirportFare,
  deleteAirportFare,
  getAirportFareById,
  getAllAirportFares,
} = require("../../controllers/admin/airportController");
const { upload, handlingMulterError } = require("../../utils/multerUtil");

const router = require("express").Router();

router.post(
  "/create",
  (req, res, next) => {
    req.destination = "airport";
    next();
  },
  upload,
  handlingMulterError,
  createAirportFare
);

router.put(
  "/update",
  (req, res, next) => {
    req.destination = "airport";
    next();
  },
  upload,
  handlingMulterError,
  updateAirportFare
);

router.get("/", getAllAirportFares).get("/airport-fare", getAirportFareById);

router.delete("/delete", deleteAirportFare);

module.exports = router;
