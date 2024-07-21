const {
  createAirportFare,
  updateAirportFare,
  deleteAirportFare,
  getAirportFareById,
  getAllAirportFares,
} = require("../../controllers/admin/airportController");
const { verifyAdmin } = require("../../middlewares/verify");
const { upload, handlingMulterError } = require("../../utils/multerUtil");

const router = require("express").Router();

router.post(
  "/create",
  verifyAdmin,
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
  verifyAdmin,
  (req, res, next) => {
    req.destination = "airport";
    next();
  },
  upload,
  handlingMulterError,
  updateAirportFare
);

router.get("/", getAllAirportFares).get("/airport-fare", getAirportFareById);

router.delete("/delete", verifyAdmin, deleteAirportFare);

module.exports = router;
