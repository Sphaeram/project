const db = require("../../models");
const checkCoupon = require("../../utils/checkCoupon");
const { TIME_ZONE } = require("../../utils/constants");
const { sanitizeFields } = require("../../utils/otherUtils");
const moment = require("moment-timezone");

const allowedFields = ["code", "discount", "valid_from", "valid_to", "status"];

module.exports = {
  createCoupon: async (req, res, next) => {
    if (Object.keys(req.body).length === 0)
      return res.status(400).json({ data: "Bad Request!" });
    const sanitizedFields = sanitizeFields(allowedFields, req.body);
    sanitizedFields.valid_from = moment
      .tz(sanitizedFields.valid_from, "YYYY-MM-DD", TIME_ZONE)
      .utc();
    sanitizedFields.valid_to = moment
      .tz(sanitizedFields.valid_to, "YYYY-MM-DD", TIME_ZONE)
      .utc();
    try {
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

    if (sanitizedFields.valid_from && sanitizedFields.valid_from !== "")
      sanitizedFields.valid_from = moment
        .tz(sanitizedFields.valid_from, "YYYY-MM-DD", TIME_ZONE)
        .utc();
    if (sanitizedFields.valid_to && sanitizedFields.valid_to !== "")
      sanitizedFields.valid_to = moment
        .tz(sanitizedFields.valid_to, "YYYY-MM-DD", TIME_ZONE)
        .utc();

    try {
      const coupon = await db.coupon.findByPk(couponId);
      if (!coupon) return res.status(404).json({ data: "Coupon Not Found!" });
      const [rowsAffected] = await db.coupon.update(sanitizedFields, {
        where: { id: coupon.id },
      });
      if (rowsAffected === 0)
        return res.status(500).json({ data: "No Coupon Updated!" });

      return res.status(200).json({ data: "Coupon Updated Successfully!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getAllCoupons: async (req, res, next) => {
    try {
      const coupons = await db.coupon.findAll({ raw: true });
      if (!coupons || coupons.length === 0)
        return res.status(404).json({ data: "No Coupons Found!" });

      coupons.forEach((coupon) => {
        if (
          moment(coupon.valid_from)
            .tz(TIME_ZONE)
            .isBefore(moment().tz(TIME_ZONE))
        ) {
          coupon.status = "inactive";
        }
        coupon.valid_from = moment(coupon.valid_from)
          .tz(TIME_ZONE)
          .format("YYYY-MM-DD");
        coupon.valid_to = moment(coupon.valid_to)
          .tz(TIME_ZONE)
          .format("YYYY-MM-DD");
      });

      return res.status(200).json({ data: coupons?.reverse() });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getCouponById: async (req, res, next) => {
    const { couponId } = req.query;
    if (!couponId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const coupon = await db.coupon.findByPk(couponId, { raw: true });
      if (!coupon) return res.status(400).json({ data: "Coupon Not Found!" });
      coupon.valid_from = moment(coupon.valid_from)
        .tz(TIME_ZONE)
        .format("YYYY-MM-DD");
      coupon.valid_to = moment(coupon.valid_to)
        .tz(TIME_ZONE)
        .format("YYYY-MM-DD");

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

  deleteAllCoupons: async (req, res) => {
    try {
      const coupons = await db.coupon.findAll({ raw: true });
      if (coupons.length === 0)
        return res.status(404).json({ data: "No Coupons Found!" });
      await db.coupon.destroy({ where: {} });
      return res.status(200).json({ data: "All Coupons Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  verifyCoupon: async (req, res) => {
    const { coupon } = req.query;
    if (!coupon) return res.status(400).json({ data: "Bad Request!" });
    try {
      const couponResult = await checkCoupon(req.user.id, coupon);
      if (couponResult.status && couponResult.message)
        return res
          .status(couponResult.status)
          .json({ data: couponResult.message });

      return res.status(200).json({ data: couponResult });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
