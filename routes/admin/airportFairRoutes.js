const airportFairController = require("../../controllers/admin/airportFairController");

const router = require("express").Router();

router.post("/create", airportFairController.createFair);

router.put("/update", airportFairController.updateFairById);

router
  .get("/", airportFairController.getAllFairs)
  .get("/fair", airportFairController.updateFairById);

router.delete("/delete", airportFairController.deleteFairById);

module.exports = router;
