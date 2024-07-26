const db = require("../../models");
const moment = require("moment-timezone");
const { TIME_ZONE } = require("../../utils/constants");

module.exports = {
  updateBookingStatus: async (req, res) => {
    const { bookingId } = req.query;
    let t = "";
    if (
      !bookingId ||
      isNaN(bookingId) ||
      !["pending approval", "confirmed", "on route", "complete"].includes(
        req.body.status?.toLowerCase()
      )
    )
      return res.status(400).json({ data: "Bad Request!" });
    if (req.body.status === "complete") t = await db.sequelize.transaction();

    try {
      const booking = await db.booking.findByPk(bookingId);
      if (!booking) return res.status(404).json({ data: "Booking not found!" });

      if (req.body.status === "complete") {
        await db.booking.update(
          { status: req.body.status },
          { where: { id: booking.id }, transaction: t }
        );
        await db.car.update(
          { booked: 0 },
          { where: { id: booking.car_id }, transaction: t }
        );
        await t.commit();
      } else {
        await db.booking.update(
          { status: req.body.status },
          { where: { id: bookingId } }
        );
      }

      return res
        .status(200)
        .json({ data: "Booking Status Updated Successfully!" });
    } catch (error) {
      if (req.body.status === "complete") await t.rollback();
      return res.status(500).json({ data: error.message });
    }
  },
  getAllBookings: async (req, res) => {
    try {
      const bookings = await db.booking.findAll({
        include: [
          {
            model: db.user,
            attributes: ["id", "username"],
            include: { model: db.user_type, attributes: ["title"] },
          },
          {
            model: db.car,
            attributes: ["id", "type", "driver_name", "number_plate"],
          },
        ],
      });
      if (!bookings || bookings.length === 0)
        return res.status(404).json({ data: "No Bookings Found!" });

      bookings.forEach((booking) => {
        booking.booking_date = moment
          .utc(booking.booking_date)
          .tz(TIME_ZONE)
          .format("YYYY-MM-DD h:mm A");
      });

      return res.status(200).json({ data: bookings });
    } catch (error) {
      return res.status(200).json({ data: error.message });
    }
  },

  getBookingById: async (req, res) => {
    const { bookingId } = req.query;
    if (!bookingId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const booking = await db.booking.findByPk(bookingId, {
        include: [
          {
            model: db.user,
            attributes: ["id", "username"],
            include: { model: db.user_type, attributes: ["title"] },
          },
          {
            model: db.car,
            attributes: ["id", "type", "driver_name", "number_plate"],
          },
        ],
      });
      if (!booking) return res.status(404).json({ data: "No Booking Found!" });

      booking.booking_date = moment
        .utc(booking.booking_date)
        .tz(TIME_ZONE)
        .format("YYYY-MM-DD h:mm A");

      return res.status(200).json({ data: booking });
    } catch (error) {
      return res.status(200).json({ data: error.message });
    }
  },

  deleteBookingById: async (req, res) => {
    const { bookingId } = req.query;
    if (!bookingId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const booking = await db.booking.findByPk(bookingId);
      if (!booking) return res.status(400).json({ data: "Booking Not Found!" });
      await db.booking.destroy({ where: { id: bookingId } });
      return res.status(200).json({ data: "Booking Deleted!" });
    } catch (error) {
      return res.status(200).json({ data: error.message });
    }
  },

  deleteAllBookings: async (req, res) => {
    try {
      const bookings = await db.booking.findAll({ raw: true });
      if (bookings.length === 0)
        return res.status(404).json({ data: "No Bookings Found!" });
      await db.booking.destroy({ where: {} });
      return res.status(200).json({ data: "All Bookings Deleted!" });
    } catch (error) {
      return res.status(200).json({ data: error.message });
    }
  },
};
