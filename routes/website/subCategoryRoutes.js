const router = require("express").Router();
const subCategoryController = require("../../controllers/admin/subCategoryController");

router
  .get("/", subCategoryController.getAllSubCategories)
  .get("/sub-category", subCategoryController.getSubCategoryById);

module.exports = router;
