const db = require("../../models");
const { convertDateToUTC, convertTimeToUTC } = require("../../utils/dateTimeUtil");

module.exports = {
  createBooking: async (req, res, next) => {
    const userId = req.user.id;
    const { package_id, fare_id, car_id, coupon_id, discount, subtotal, total_price } = req.info;

    const sanitizedFields = {
      user_id: userId,
      car_id: car_id,
      package_id: package_id,
      fare_id: fare_id,
      coupon_id: coupon_id,
      sub_total: subtotal,
      discount: discount,
      total_price: total_price,
    };

    sanitizedFields.pickup_date = convertDateToUTC(req.body.pickup_date, req.body.pickup_time);
    sanitizedFields.pickup_time = convertTimeToUTC(req.body.pickup_time);

    try {
      const booking = await db.booking.create(sanitizedFields);

      if (coupon_id) {
        await db.coupon_collected.create({
          coupon_id: coupon_id,
          booking_id: booking.id,
          user_id: userId,
        });
      }

      return res.status(200).json({ data: booking });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
