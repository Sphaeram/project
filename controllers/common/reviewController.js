const db = require("../../models");
const { sanitizeFields } = require("../../utils/otherUtils");

const createReview = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ data: "Bad Request!" });
  const sanitizedFields = sanitizeFields(
    ["booking_id", "user_id", "booking_type", "review"],
    req.body
  );
  try {
    const review = await db.review.create(sanitizedFields);
    return res.status(201).json({ data: review });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const updateReview = async (req, res) => {
  const { reviewId } = req.query;
  if (!reviewId || isNaN(reviewId) || Object.keys(req.body).length === 0)
    return res.status(400).json({ data: "Bad Request!" });

  const sanitizedFields = sanitizeFields(
    ["booking_id", "user_id", "booking_type", "review"],
    req.body
  );
  try {
    const review = await db.review.findByPk(reviewId, { raw: true });
    if (!review) return res.status(404).json({ data: "Review Not Found!" });

    await db.review.update(sanitizedFields, { where: { id: review.id } });

    return res.status(201).json({ data: "Review Updated!" });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const reviews = await db.review.findAll({
      where: { user_id: req.user.id },
      raw: true,
    });
    if (reviews.length === 0)
      return res.status(404).json({ data: "Reviews Not Found!" });

    return res.status(200).json({ data: reviews });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const getAllreviews = async (req, res, next) => {
  try {
    const reviews = await db.review.findAll();
    if (!reviews || reviews.length === 0)
      return res.status(404).json({ data: "No Reviews Found!" });
    return res.status(200).json({ data: reviews });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const getUserReviewById = async (req, res, next) => {
  const { userId, reviewId } = req.query;
  if (!reviewId || !userId || isNaN(reviewId) || isNaN(userId))
    return res.status(400).json({ data: "Bad Request!" });
  try {
    const review = await db.review.findOne({
      where: { id: reviewId, user_id: userId },
    });
    if (!review) return res.status(404).json({ data: "No Review Found!" });
    return res.status(200).json({ data: review });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const getReviewById = async (req, res, next) => {
  const { reviewId } = req.query;
  if (!reviewId || isNaN(reviewId))
    return res.status(400).json({ data: "Bad Request!" });
  try {
    const review = await db.review.findByPk(reviewId);
    if (!review) return res.status(404).json({ data: "No Review Found!" });
    return res.status(200).json({ data: review });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = {
  createReview,
  updateReview,
  getUserReviews,
  getAllreviews,
  getUserReviewById,
  getReviewById,
};
