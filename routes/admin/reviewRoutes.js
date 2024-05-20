const reviewController = require("../../controllers/admin/reviewController");

const router = require("express").Router();

router.get("/", reviewController.getAllreviews).get("/review", reviewController.getReviewById);

module.exports = router;
