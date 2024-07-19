const {
  createZiyarat,
  updateZiyarat,
  getZiyarats,
  getZiyaratById,
  getZiyaratsByCarId,
  deleteZiyaratById,
} = require("../../controllers/admin/ziyaratController");
const { upload, handlingMulterError } = require("../../utils/multerUtil");

const router = require("express").Router();

router.post(
  "/create",
  (req, res, next) => {
    req.destination = "ziyarat";
    next();
  },
  upload,
  handlingMulterError,
  createZiyarat
);

router.put(
  "/update",
  (req, res, next) => {
    req.destination = "ziyarat";
    next();
  },
  upload,
  handlingMulterError,
  updateZiyarat
);

router
  .get("/", getZiyarats)
  .get("/ziyarat", getZiyaratById)
  .get("/car-ziyarats", getZiyaratsByCarId);

router.delete("/delete", deleteZiyaratById);

module.exports = router;
