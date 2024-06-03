const fareController = require("../../controllers/admin/fareController");

const router = require("express").Router();

router.post("/create", fareController.createfare);

router.put("/update", fareController.updatefareById);

router
  .get("/", fareController.getAllfares)
  .get("/airport", fareController.getAllAirportFairs)
  .get("/railway", fareController.getAllTrainFairs)
  .get("/fair", fareController.getfareById)
  .get("/search", fareController.fareSearch);

router.delete("/delete", fareController.deletefareById);

module.exports = router;
