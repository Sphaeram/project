const db = require("../../models");
const moment = require("moment-timezone");
const { TIME_ZONE } = require("../../utils/constants");
const { sanitizeFields } = require("../../utils/otherUtils");

module.exports = {
  updateBookingStatus: async (req, res) => {
    const { bookingId } = req.query;
    let t = "";
    if (
      !bookingId ||
      isNaN(bookingId) ||
      ![
        "pending approval",
        "confirmed",
        "on route",
        "complete",
        "cancelled",
      ].includes(req.body.status?.toLowerCase())
    )
      return res.status(400).json({ data: "Bad Request!" });
    if (req.body.status === "complete" || req.body.status === "cancelled")
      t = await db.sequelize.transaction();

    try {
      const booking = await db.booking.findByPk(bookingId);
      if (!booking) return res.status(404).json({ data: "Booking not found!" });

      if (req.body.status === "complete" || req.body.status === "cancelled") {
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
      if (req.body.status === "complete" || req.body.status === "cancelled")
        await t.rollback();
      return res.status(500).json({ data: error.message });
    }
  },

  updateBooking: async (req, res) => {
    const { bookingId } = req.query;
    if (!bookingId || Object.keys(req.body).length === 0)
      return res.status(400).json({ data: "Bad Request!" });
    let t = "";
    const sanitizedBookings = sanitizeFields(
      ["car_id", "driver_name", "total_price", "status"],
      req.body
    );

    if (
      sanitizedBookings.status &&
      ![
        "pending approval",
        "confirmed",
        "on route",
        "complete",
        "cancelled",
      ].includes(sanitizedBookings.status?.toLowerCase())
    )
      return res.status(400).json({ data: "Bad Request!" });

    if (
      sanitizedBookings.car_id ||
      sanitizedBookings.status === "complete" ||
      sanitizedBookings.status === "cancelled"
    )
      t = await db.sequelize.transaction();

    try {
      const booking = await db.booking.findByPk(bookingId);
      if (!booking) return res.status(404).json({ data: "Booking not found!" });

      if (
        sanitizedBookings.car_id ||
        sanitizedBookings.status === "complete" ||
        sanitizedBookings.status === "cancelled"
      ) {
        let car = "";
        if (sanitizedBookings.car_id) {
          car = await db.car.findByPk(sanitizedBookings.car_id);
          if (!car) return res.status(404).json({ data: "Car not found!" });
          if (car.booked)
            return res.status(409).json({ data: "Car is already booked!" });
        }
        await db.booking.update(sanitizedBookings, {
          where: { id: booking.id },
          transaction: t,
        });
        if (car && sanitizedBookings.status !== "cancelled") {
          await db.car.update(
            { booked: 1 },
            { where: { id: car.id }, transaction: t }
          );
        }

        await db.car.update(
          { booked: 0 },
          { where: { id: booking.car_id }, transaction: t }
        );
        await t.commit();
        return res.status(200).json({ data: "Booking Updated Successfully!" });
      } else {
        await db.booking.update(sanitizedBookings, {
          where: { id: booking.id },
        });
        return res.status(200).json({ data: "Booking Updated Successfully!" });
      }
    } catch (error) {
      if (
        sanitizedBookings.car_id ||
        sanitizedBookings.status === "complete" ||
        sanitizedBookings.status === "cancelled"
      )
        await t.rollback();
      return res.status(500).json({ data: error.message });
    }
  },

  getAllBookings: async (req, res) => {
    try {
      const pendingBookings = await db.booking.findAll({
        where: { status: "pending approval" },
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
      const confirmedBookings = await db.booking.findAll({
        where: { status: "confirmed" },
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
      const onRouteBookings = await db.booking.findAll({
        where: { status: "on route" },
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
      const completedBookings = await db.booking.findAll({
        where: { status: "complete" },
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
      const cancelledBookings = await db.booking.findAll({
        where: { status: "cancelled" },
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

      const bookings = [
        ...pendingBookings?.reverse(),
        ...confirmedBookings?.reverse(),
        ...onRouteBookings?.reverse(),
        ...completedBookings?.reverse(),
        ...cancelledBookings?.reverse(),
      ];

      if (!bookings || bookings.length === 0)
        return res.status(404).json({ data: "No Bookings Found!" });

      bookings.forEach((booking) => {
        booking.booking_date = moment
          .utc(booking.booking_date)
          .tz(TIME_ZONE)
          .format("YYYY-MM-DD h:mm A");
        booking.car.driver_name = booking.driver_name;
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
      booking.car.driver_name = booking.driver_name;

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
      if (booking.status !== "complete") {
        try {
          const t = await db.sequelize.transaction();
          await db.booking.destroy({
            where: { id: bookingId },
            transaction: t,
          });
          await db.car.update(
            { booked: 0 },
            { where: { id: booking.car_id }, transaction: t }
          );
          await t.commit();
        } catch (error) {
          await t.rollback();
          return res.status(404).json({ data: error.message });
        }
      } else {
        await db.booking.destroy({ where: { id: bookingId } });
      }
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
      await db.car.update({ booked: 0 }, { where: {} });
      return res.status(200).json({ data: "All Bookings Deleted!" });
    } catch (error) {
      return res.status(200).json({ data: error.message });
    }
  },
};
