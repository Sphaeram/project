const db = require("../../models");
const path = require("path");
const { deleteLocalFile, sanitizeFields } = require("../../utils/otherUtils");

const allowedFields = ["category_id", "title", "description", "image"];

module.exports = {
  createSubCategory: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    if (req.files && req.files["sub_category_image"] && req.files["sub_category_image"].length > 0)
      sanitizedFields.image = `${req.files["sub_category_image"][0].destination.substring(7)}/${
        req.files["sub_category_image"][0].filename
      }`;

    try {
      const category = await db.sub_category.create(sanitizedFields);
      return res.status(200).json({ data: category });
    } catch (error) {
      if (
        req.files &&
        req.files["sub_category_image"] &&
        req.files["sub_category_image"].length > 0
      )
        deleteLocalFile(path.join(__dirname, `../../public/${sanitizedFields.image}`));

      return res.status(500).json({ data: error.message });
    }
  },

  updateSubCategory: async (req, res, next) => {
    let image = false;
    const { subCategoryId } = req.query;
    if (!subCategoryId) throw new Error("Bad Request!");

    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    if (
      req.files &&
      req.files["sub_category_image"] &&
      req.files["sub_category_image"].length > 0
    ) {
      image = true;
      sanitizedFields.image = `${req.files["sub_category_image"][0].destination.substring(7)}/${
        req.files["sub_category_image"][0].filename
      }`;
    }
    try {
      const subCategory = await db.sub_category.findByPk(subCategoryId);
      if (!subCategory) throw new Error("Sub Category Not Found!");

      const [rowsAffected] = await db.sub_category.update(sanitizedFields, {
        where: { id: subCategory.id },
      });
      if (rowsAffected === 0) throw new Error("Sub Category Not Updated!");

      if (image) deleteLocalFile(path.join(__dirname, `../../public/${subCategory.image}`));

      return res.status(200).json({ data: "Sub Category Updated!" });
    } catch (error) {
      if (
        req.files &&
        req.files["sub_category_image"] &&
        req.files["sub_category_image"].length > 0
      )
        deleteLocalFile(path.join(__dirname, `../../public/${sanitizedFields.image}`));

      return res.status(500).json({ data: error.message });
    }
  },

  getAllSubCategories: async (req, res, next) => {
    try {
      const subCategories = await db.sub_category.findAll();
      if (!subCategories || subCategories.length === 0)
        return res.status(404).json("No Sub Categories Found!");
      return res.status(200).json({ data: subCategories });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getSubCategoryById: async (req, res, next) => {
    const { subCategoryId } = req.query;
    if (!subCategoryId) return res.status(400).json({ data: "Bad Request" });
    try {
      const subCategory = await db.sub_category.findByPk(subCategoryId);
      if (!subCategory) return res.status(404).json({ data: "sub Category Not Found!" });
      return res.status(200).json({ data: subCategory });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deleteSubCategory: async (req, res, next) => {
    const { subCategoryId } = req.query;
    if (!subCategoryId) return res.status(400).json({ data: "Bad Request" });
    try {
      const subCategory = await db.sub_category.findByPk(subCategoryId);
      if (!subCategory) return res.status(404).json({ data: "Sub Category Not Found!" });
      await db.sub_category.destroy({ where: { id: subCategoryId } });
      return res.status(200).json({ data: "Sub Category Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
