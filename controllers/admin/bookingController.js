const db = require("../../models");

module.exports = {
  getAllBookings: async (req, res, next) => {
    try {
      const bookings = await db.booking.findAll();
      if (!bookings || bookings.length === 0)
        return res.status(404).json({ data: "No Bookings Found!" });

      return res.status(200).json({ data: bookings });
    } catch (error) {
      return res.status(200).json({ data: error.message });
    }
  },

  getBookingById: async (req, res, next) => {
    const { bookingId } = req.query;
    if (!bookingId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const booking = await db.booking.findByPk(bookingId);
      if (!booking) return res.status(404).json({ data: "No Booking Found!" });

      return res.status(200).json({ data: booking });
    } catch (error) {
      return res.status(200).json({ data: error.message });
    }
  },

  deleteBookingById: async (req, res, next) => {
    const { bookingId } = req.query;
    if (!bookingId) return res.status(400).json({ data: "Bad Request!" });
    try {
      await db.booking.destroy({ where: { id: bookingId } });

      return res.status(200).json({ data: "Booking Deleted!" });
    } catch (error) {
      return res.status(200).json({ data: error.message });
    }
  },
};
