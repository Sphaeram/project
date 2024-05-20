const couponController = require("../../controllers/admin/couponController");

const router = require("express").Router();

router.post("/create", couponController.createCoupon);

router.put("/update", couponController.updateCoupon);

router.get("/", couponController.getAllCoupons).get("/coupon", couponController.getCouponById);

router.delete("/delete", couponController.deleteCoupon);

module.exports = router;
