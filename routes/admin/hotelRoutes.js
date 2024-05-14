const hotelController = require("../../controllers/admin/hotelController");
const { upload, handlingMulterError } = require("../../utils/multerUtil");

const router = require("express").Router();

router.post(
  "/create",
  (req, res, next) => {
    req.destination = "hotel";
    next();
  },
  upload,
  handlingMulterError,
  hotelController.createHotel
);

router.put(
  "/update",
  (req, res, next) => {
    req.destination = "hotel";
    next();
  },
  upload,
  handlingMulterError,
  hotelController.updateHotelById
);

router.get("/", hotelController.getAllHotels).get("/hotel", hotelController.getHotelById);

router.delete("/delete", hotelController.deleteHotelById);

module.exports = router;
