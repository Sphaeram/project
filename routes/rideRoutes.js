const { getPickupPoints, getDropPoints } = require("../controllers/common/rideController");

const router = require("express").Router();

router.get("/pickup-points", getPickupPoints).get("/drop-points", getDropPoints);

module.exports = router;
