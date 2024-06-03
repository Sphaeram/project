const db = require("../models");
const moment = require("moment-timezone");

const TIME_ZONE = "Asia/karachi";

const checkCoupon = async (user_id, code) => {
  try {
    const foundCoupon = await db.coupon.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { code: code },
      raw: true,
    });
    if (!foundCoupon) return { status: 404, message: "Coupon Not Found!" };

    const validFrom = moment(foundCoupon.valid_from).tz(TIME_ZONE);
    const validTo = moment(foundCoupon.valid_to).tz(TIME_ZONE);
    const currentDate = moment().tz(TIME_ZONE);

    if (currentDate.isBefore(validFrom)) {
      return {
        status: 403,
        message: `You can only use this coupon from ${validFrom.format(
          "YYYY-MM-DD"
        )} to ${validTo.format("YYYY-MM-DD")}`,
      };
    }

    if (currentDate.isAfter(validTo)) return { status: 403, message: "Coupon has Expired!" };

    const couponsUsed = await db.coupon_collected.findAll({
      where: { coupon_id: foundCoupon.id, user_id: user_id },
      raw: true,
    });

    if (couponsUsed.length === 0 || couponsUsed.length < foundCoupon.uses_per_user)
      return foundCoupon;
    else return { status: 403, message: "You can't use this coupon anymore!" };
  } catch (error) {
    return { status: 500, message: error.message };
  }
};

module.exports = checkCoupon;
