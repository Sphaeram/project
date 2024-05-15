const subCategoryController = require("../../controllers/admin/subCategoryController");
const { handlingMulterError, upload } = require("../../utils/multerUtil");

const router = require("express").Router();

router.post(
  "/create",
  (req, res, next) => {
    req.destination = "sub_category";
    next();
  },
  upload,
  handlingMulterError,
  subCategoryController.createSubCategory
);

router.put(
  "/update",
  (req, res, next) => {
    req.destination = "sub_category";
    next();
  },
  upload,
  handlingMulterError,
  subCategoryController.updateSubCategory
);

router
  .get("/", subCategoryController.getAllSubCategories)
  .get("/sub-category", subCategoryController.getSubCategoryById);

router.delete("/delete", subCategoryController.deleteSubCategory);

module.exports = router;
