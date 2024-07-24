const couponController = require("../../controllers/admin/couponController");

const { verifyAdmin } = require("../../middlewares/verify");
const router = require("express").Router();

router.post("/create", verifyAdmin, couponController.createCoupon);

router.put("/update", verifyAdmin, couponController.updateCoupon);

router
  .get("/", couponController.getAllCoupons)
  .get("/coupon", couponController.getCouponById);

router
  .delete("/delete", verifyAdmin, couponController.deleteCoupon)
  .delete("/delete-all", verifyAdmin, couponController.deleteAllCoupons);

module.exports = router;
