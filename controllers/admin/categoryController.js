const db = require("../../models");
const path = require("path");
const { sanitizeFields, deleteLocalFile } = require("../../utils/otherUtils");

const allowedFields = ["title", "description", "image"];

module.exports = {
  createCategory: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    if (req.files && req.files["category_image"] && req.files["category_image"].length > 0)
      sanitizedFields.image = `${req.files["category_image"][0].destination.substring(7)}/${
        req.files["category_image"][0].filename
      }`;

    try {
      const category = await db.category.create(sanitizedFields);
      return res.status(200).json({ data: category });
    } catch (error) {
      if (req.files && req.files["category_image"] && req.files["category_image"].length > 0)
        deleteLocalFile(path.join(__dirname, `../../public/${sanitizedFields.image}`));

      return res.status(500).json({ data: error.message });
    }
  },

  updateCategory: async (req, res, next) => {
    let image = false;
    const { categoryId } = req.query;
    if (!categoryId) throw new Error("Bad Request!");

    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    if (req.files && req.files["category_image"] && req.files["category_image"].length > 0) {
      image = true;
      sanitizedFields.image = `${req.files["category_image"][0].destination.substring(7)}/${
        req.files["category_image"][0].filename
      }`;
    }
    try {
      const category = await db.category.findByPk(categoryId);
      if (!category) throw new Error("Category Not Found!");

      const [rowsAffected] = await db.category.update(sanitizedFields, {
        where: { id: category.id },
      });
      if (rowsAffected === 0) throw new Error("Category Not Updated!");

      if (image) deleteLocalFile(path.join(__dirname, `../../public/${category.image}`));

      return res.status(200).json({ data: "Category Updated!" });
    } catch (error) {
      if (req.files && req.files["category_image"] && req.files["category_image"].length > 0)
        deleteLocalFile(path.join(__dirname, `../../public/${sanitizedFields.image}`));

      return res.status(500).json({ data: error.message });
    }
  },

  getAllCategories: async (req, res, next) => {
    try {
      const categories = await db.category.findAll();
      if (!categories || categories.length === 0)
        return res.status(404).json("No Categories Found!");
      return res.status(200).json({ data: categories });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getCategoryById: async (req, res, next) => {
    const { categoryId } = req.query;
    if (!categoryId) return res.status(400).json({ data: "Bad Request" });
    try {
      const category = await db.category.findByPk(categoryId);
      if (!category) return res.status(404).json({ data: "Category Not Found!" });
      return res.status(200).json({ data: category });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deleteCategory: async (req, res, next) => {
    const { categoryId } = req.query;
    if (!categoryId) return res.status(400).json({ data: "Bad Request" });
    try {
      const category = await db.category.findByPk(categoryId);
      if (!category) return res.status(404).json({ data: "Category Not Found!" });
      await db.category.destroy({ where: { id: categoryId } });
      return res.status(200).json({ data: "Category Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
