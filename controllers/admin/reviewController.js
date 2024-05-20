const db = require("../../models/index");

module.exports = {
  getAllreviews: async (req, res, next) => {
    try {
      const reviews = await db.review.findAll();
      if (!reviews || reviews.length === 0)
        return res.status(404).json({ data: "No Reviews Found!" });
      return res.status(200).json({ data: reviews });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getReviewById: async (req, res, next) => {
    const { reviewId } = req.query;
    if (!reviewId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const review = await db.review.findByPk(reviewId);
      if (!review) return res.status(404).json({ data: "No Review Found!" });
      return res.status(200).json({ data: review });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
