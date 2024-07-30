const {
  createReview,
  updateReview,
  getUserReviews,
  getAllreviews,
  getReviewById,
  getUserReviewById,
  deleteReviewById,
  deleteAllReviews,
} = require("../controllers/common/reviewController");
const { verifyLogin, verifyAdmin } = require("../middlewares/verify");

const router = require("express").Router();

router.post("/create", verifyLogin, createReview);

router.put("/update", verifyLogin, updateReview);

router
  .get("/", getAllreviews)
  .get("/review", getReviewById)
  .get("/user-reviews", verifyLogin, getUserReviews)
  .get("/user-review", verifyLogin, getUserReviewById);

router
  .delete("/delete-review", verifyLogin, deleteReviewById)
  .delete("/delete-all", verifyAdmin, deleteAllReviews);

module.exports = router;
