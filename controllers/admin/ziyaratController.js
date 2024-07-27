const db = require("../../models");
const {
  sanitizeFields,
  deleteFile,
  convertToJpeg,
} = require("../../utils/otherUtils");

const allowedFields = ["car_id", "ziyarat_name", "price"];

const createZiyarat = async (req, res) => {
  const sanitizedFields = sanitizeFields(allowedFields, req.body);

  const t = await db.sequelize.transaction();

  try {
    if (
      req.files &&
      req.files?.ziyarat_image &&
      req.files?.ziyarat_image.length > 0
    ) {
      sanitizedFields.image = `${req.files[
        "ziyarat_image"
      ][0].destination.substring(7)}/${req.files?.ziyarat_image[0].filename}`;
      // If the file is in binary (sent from a flutter web application)
      if (!sanitizedFields.image?.split(".")[1]) {
        const format = await convertToJpeg(
          `${sanitizedFields.image}`,
          `${sanitizedFields.image}.jpeg`
        );
        sanitizedFields.image = sanitizedFields.image?.concat(".", format);
      }
    }

    if (Object.keys(req.body).length === 0) {
      deleteFile(sanitizedFields.image);
      return res.status(400).json({ data: "Bad Request!" });
    }

    const sanitizedZiyaratPoints = JSON.parse(req.body?.ziyarat_points);
    const ziyarat = await db.category.create(sanitizedFields, {
      transaction: t,
    });

    await db.sub_category.create(
      {
        category_id: ziyarat.id,
        ziyarat_points: JSON.stringify(sanitizedZiyaratPoints),
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(200).json({ data: ziyarat });
  } catch (error) {
    await t.rollback();
    if (
      req.files &&
      req.files?.ziyarat_image &&
      req.files?.ziyarat_image?.length > 0
    )
      deleteFile(sanitizedFields.image);

    return res.status(500).json({ data: error.message });
  }
};

const updateZiyarat = async (req, res) => {
  let image = false;
  const { ziyaratId } = req.query;
  const sanitizedFields = sanitizeFields(allowedFields, req.body);
  const t = await db.sequelize.transaction();

  try {
    if (
      req.files &&
      req.files?.ziyarat_image &&
      req.files?.ziyarat_image?.length > 0
    ) {
      image = true;
      sanitizedFields.image = `${req.files[
        "ziyarat_image"
      ][0].destination.substring(7)}/${req.files?.ziyarat_image[0].filename}`;
      // If the file is in binary (sent from a flutter web application)
      if (!sanitizedFields.image?.split(".")[1]) {
        const format = await convertToJpeg(
          `${sanitizedFields.image}`,
          `${sanitizedFields.image}.jpeg`
        );
        sanitizedFields.image = sanitizedFields.image?.concat(".", format);
      }
    }

    if (!ziyaratId || Object.keys(req.body).length === 0) {
      deleteFile(sanitizedFields.image);
      return res.status(400).json({ data: "Bad Request!" });
    }
    const sanitizedZiyaratPoints = JSON.parse(req.body?.ziyarat_points);
    const ziyarat = await db.category.findByPk(ziyaratId);
    if (!ziyarat) {
      deleteFile(sanitizedFields.image);
      return res.status(404).json({ data: "Ziyarat not found!" });
    }

    await db.category.update(sanitizedFields, {
      where: { id: ziyarat.id },
      transaction: t,
    });
    await db.sub_category.update(
      { ziyarat_points: JSON.stringify(sanitizedZiyaratPoints) },
      { where: { category_id: ziyarat.id }, transaction: t }
    );
    if (image) deleteFile(ziyarat.image);

    await t.commit();
    return res.status(200).json({ data: "Zirayat Updated!" });
  } catch (error) {
    await t.rollback();
    if (
      req.files &&
      req.files?.ziyarat_image &&
      req.files?.ziyarat_image?.length > 0
    )
      deleteFile(sanitizedFields.image);

    return res.status(500).json({ data: error.message });
  }
};

const getZiyaratById = async (req, res) => {
  const { ziyaratId } = req.query;
  if (!ziyaratId || isNaN(ziyaratId))
    return res.status(400).json({ data: "Bad Request!" });
  try {
    const ziyarat = await db.category.findByPk(ziyaratId, {
      include: [{ model: db.sub_category, attributes: ["ziyarat_points"] }],
    });
    if (!ziyarat) return res.status(404).json({ data: "Ziyarat not found!" });

    return res.status(200).json({ data: ziyarat });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const getZiyarats = async (req, res) => {
  try {
    const ziyarats = await db.category.findAll({
      include: [{ model: db.sub_category, attributes: ["ziyarat_points"] }],
    });
    return res.status(200).json({ data: ziyarats });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const getZiyaratsByCarId = async (req, res) => {
  const { carId } = req.query;
  if (!carId || isNaN(carId))
    return res.status(400).json({ data: "Bad Request!" });

  try {
    const ziyarats = await db.category.findAll({
      where: { car_id: carId },
      include: [{ model: db.sub_category, attributes: ["ziyarat_points"] }],
    });
    return res.status(200).json({ data: ziyarats });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const deleteZiyaratById = async (req, res) => {
  const { ziyaratId } = req.query;
  if (!ziyaratId || isNaN(ziyaratId))
    return res.status(400).json({ data: "Bad Request!" });

  try {
    const ziyarat = await db.category.findByPk(ziyaratId);
    if (!ziyarat) return res.status(404).json({ data: "Ziyarat not found!" });
    await db.category.destroy({ where: { id: ziyarat.id } });
    await db.sub_category.destroy({ where: { category_id: ziyarat.id } });

    return res
      .status(200)
      .json({ data: "Ziyarat & its related data deleted!" });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const deleteAllZiyarats = async (req, res) => {
  try {
    const categories = await db.category.findAll();
    if (categories.length === 0)
      return res.status(404).json({ data: "No Ziyarats Found!" });
    await db.category.destroy({ where: {}, truncate: true });
    await db.sub_category.destroy({ where: {}, truncate: true });
    return res
      .status(200)
      .json({ data: "All ziyarats and related data deleted!" });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = {
  createZiyarat,
  updateZiyarat,
  getZiyaratById,
  getZiyarats,
  getZiyaratsByCarId,
  deleteZiyaratById,
  deleteAllZiyarats,
};
