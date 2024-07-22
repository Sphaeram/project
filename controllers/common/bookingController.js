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

const getAllUserBookings = async (req, res) => {
  try {
    const bookings = await db.booking.findAll({
      attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
      where: { user_id: req.user.id },
      include: [
        {
          model: db.user,
          attributes: ["id", "username", "email", "phone_no"],
        },
        {
          model: db.car,
          attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
        },
      ],
    });
    if (bookings.length === 0) return res.status(404).json({ data: "No bookings found!" });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const cancelBooking = async (req, res) => {
  const { bookingId } = req.query;
  if (!bookingId || isNaN(bookingId)) return res.status(400).json({ data: "Bad Request!" });

  const t = await db.sequelize.transaction();
  try {
    const booking = await db.booking.findOne({
      where: { id: bookingId, user_id: req.user.id },
      raw: true,
    });
    if (!booking) return res.status(404).json({ data: "No such booking found!" });
    if (booking.status !== "pending approval")
      return res.status(403).json({ data: "You can't cancel this booking!" });

    await db.booking.update(
      { status: "cancelled" },
      {
        where: { id: booking.id, user_id: booking.user_id, status: "pending approval" },
        transaction: t,
      }
    );
    await db.car.update({ booked: 0 }, { where: { id: booking.car_id }, transaction: t });

    await t.commit();
    return res.status(200).json({ data: "Booking cancelled successfully!" });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ data: error.message });
  }
};

module.exports = { createBooking, getAllUserBookings, cancelBooking };
