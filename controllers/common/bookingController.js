const db = require("../../models");
const moment = require("moment-timezone");
const { TIME_ZONE } = require("../../utils/constants");

const createBooking = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const bookingData = req.sanitizedFields;

    bookingData.booking_date = moment().tz(TIME_ZONE).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    bookingData.booking_id += `-${moment()
      .tz(TIME_ZONE)
      .format("YYYY-MM-DD HH:mm:ss")
      .replace(/[-]/g, "")
      .replace(/[:]/g, "")
      .replace(/\s/g, "-")}`;

    const booking = await db.booking.create(bookingData, { transaction: t });

    await db.car.update({ booked: 1 }, { where: { id: bookingData.car_id }, transaction: t });

    if (req.coupon) {
      await db.coupon_collected.create(
        { coupon_id: req.coupon.id, booking_id: booking.id, user_id: bookingData.user_id },
        { transaction: t }
      );
    }

    await t.commit();
    return res.status(200).json(booking);
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ data: error.message });
  }
};

module.exports = { createBooking };
