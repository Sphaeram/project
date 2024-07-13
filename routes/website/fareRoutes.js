const fareController = require("../../controllers/admin/fareController");

const router = require("express").Router();

router
  .get("/", fareController.getAllfares)
  .get("/airport", fareController.getAllAirportFairs)
  .get("/railway", fareController.getAllTrainFairs)
  .get("/fair", fareController.getfareById)
  .get("/search", fareController.fareSearch);

module.exports = router;
