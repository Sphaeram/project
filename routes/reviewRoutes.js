const {
  createReview,
  updateReview,
  getUserReviews,
  getAllreviews,
  getReviewById,
  getUserReviewById,
} = require("../controllers/common/reviewController");
const { verifyLogin, verifyAdmin } = require("../middlewares/verify");

const router = require("express").Router();

router.post("/create", verifyLogin, createReview);

router.put("/update", verifyLogin, updateReview);

router
  .get("/", verifyAdmin, getAllreviews)
  .get("/review", verifyAdmin, getReviewById)
  .get("/user-reviews", verifyLogin, getUserReviews)
  .get("/user-review", verifyLogin, getUserReviewById);

module.exports = router;
