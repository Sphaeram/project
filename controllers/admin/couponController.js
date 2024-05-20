const db = require("../../models");
const { sanitizeFields } = require("../../utils/otherUtils");

const allowedFields = ["title", "code", "valid_from", "valid_to", "discount", "uses_per_user"];

module.exports = {
  createCoupon: async (req, res, next) => {
    try {
      const sanitizedFields = sanitizeFields(allowedFields, req.body);
      const coupon = await db.coupon.create(sanitizedFields);
      return res.status(200).json({ data: coupon });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  updateCoupon: async (req, res, next) => {
    const { couponId } = req.query;
    if (!couponId) return res.status(400).json({ data: "Bad Request!" });
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    try {
      const coupon = await db.coupon.findByPk(couponId);
      if (!coupon) return res.status(404).json({ data: "Coupon Not Found!" });
      const [rowsAffected] = await db.coupon.update(sanitizedFields, { where: { id: coupon.id } });
      if (rowsAffected === 0) return res.status(500).json({ data: "No Coupon Updated!" });

      return res.status(200).json({ data: "Coupon Updated Successfully!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getAllCoupons: async (req, res, next) => {
    try {
      const coupons = await db.coupon.findAll();
      if (!coupons || coupons.length === 0)
        return res.status(404).json({ data: "No Coupons Found!" });
      return res.status(200).json({ data: coupons });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getCouponById: async (req, res, next) => {
    const { couponId } = req.query;
    if (!couponId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const coupon = await db.coupon.findByPk(couponId);
      if (!coupon) return res.status(400).json({ data: "Coupon Not Found!" });
      return res.status(200).json({ data: coupon });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deleteCoupon: async (req, res, next) => {
    const { couponId } = req.query;
    if (!couponId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const coupon = await db.coupon.findByPk(couponId);
      if (!coupon) return res.status(400).json({ data: "Coupon Not Found!" });
      await db.coupon.destroy({ where: { id: coupon.id } });
      return res.status(200).json({ data: "Coupon Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
