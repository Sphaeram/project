const categoryController = require("../../controllers/admin/categoryController");
const { upload, handlingMulterError } = require("../../utils/multerUtil");

const router = require("express").Router();

router.post(
  "/create",
  (req, res, next) => {
    req.destination = "category";
    next();
  },
  upload,
  handlingMulterError,
  categoryController.createCategory
);

router.put(
  "/update",
  (req, res, next) => {
    req.destination = "category";
    next();
  },
  upload,
  handlingMulterError,
  categoryController.updateCategory
);

router
  .get("/", categoryController.getAllCategories)
  .get("/category", categoryController.getCategoryById);

router.delete("/delete", categoryController.deleteCategory);

module.exports = router;
