const {
  createZiyarat,
  updateZiyarat,
  getZiyarats,
  getZiyaratById,
  getZiyaratsByCarId,
  deleteZiyaratById,
  deleteAllZiyarats,
} = require("../../controllers/admin/ziyaratController");
const { verifyAdmin } = require("../../middlewares/verify");
const { upload, handlingMulterError } = require("../../utils/multerUtil");

const router = require("express").Router();

router.post(
  "/create",
  verifyAdmin,
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
  verifyAdmin,
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

router
  .delete("/delete", verifyAdmin, deleteZiyaratById)
  .delete("/delete-all", verifyAdmin, deleteAllZiyarats);

module.exports = router;
