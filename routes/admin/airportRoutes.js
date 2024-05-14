const {
  createAirport,
  getAllAirports,
  getAirportById,
  deleteAirport,
  updateAirport,
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
  createAirport
);

router.put(
  "/update",
  (req, res, next) => {
    req.destination = "airport";
    next();
  },
  upload,
  handlingMulterError,
  updateAirport
);

router.get("/", getAllAirports).get("/airport", getAirportById);

router.delete("/delete", deleteAirport);

module.exports = router;
