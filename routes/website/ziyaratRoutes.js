const {
  getZiyarats,
  getZiyaratById,
  getZiyaratsByCarId,
} = require("../../controllers/admin/ziyaratController");

const router = require("express").Router();

router
  .get("/", getZiyarats)
  .get("/ziyarat", getZiyaratById)
  .get("/car-ziyarats", getZiyaratsByCarId);

module.exports = router;
