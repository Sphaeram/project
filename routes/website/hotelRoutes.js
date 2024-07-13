const router = require("express").Router();
const hotelController = require("../../controllers/admin/hotelController");

router.get("/", hotelController.getAllHotels).get("/hotel", hotelController.getHotelById);

module.exports = router;
