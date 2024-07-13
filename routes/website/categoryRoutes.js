const categoryController = require("../../controllers/admin/categoryController");
const router = require("express").Router();

router
  .get("/", categoryController.getAllCategories)
  .get("/category", categoryController.getCategoryById);

module.exports = router;
