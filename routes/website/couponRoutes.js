const couponController = require("../../controllers/website/couponController");
const { verifyLogin } = require("../../middlewares/verify");

const router = require("express").Router();

router.post("/check-coupon", verifyLogin, couponController.checkCouponByCode);

module.exports = router;
