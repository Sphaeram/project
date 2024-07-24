const db = require("../../models/index");
const moment = require("moment-timezone");
const { TIME_ZONE } = require("../../utils/constants");

const bookedCarsAnalytics = async (req, res) => {
  try {
    const bookedCars = await db.car.count({ where: { booked: 1 } });
    return res.status(200).json({ data: bookedCars });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const bookingAnalytics = async (req, res) => {
  const tomorrow = moment().tz(TIME_ZONE).add(1, "day").startOf("day");
  const monthlyBookings = {
    Jan: {
      active: 0,
      completed: 0,
      cancelled: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_packages: 0,
      total_ziyarats: 0,
    },
    Feb: {
      active: 0,
      completed: 0,
      cancelled: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_packages: 0,
      total_ziyarats: 0,
    },
    Mar: {
      active: 0,
      completed: 0,
      cancelled: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_packages: 0,
      total_ziyarats: 0,
    },
    Apr: {
      active: 0,
      completed: 0,
      cancelled: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_packages: 0,
      total_ziyarats: 0,
    },
    May: {
      active: 0,
      completed: 0,
      cancelled: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_packages: 0,
      total_ziyarats: 0,
    },
    Jun: {
      active: 0,
      completed: 0,
      cancelled: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_packages: 0,
      total_ziyarats: 0,
    },
    Jul: {
      active: 0,
      completed: 0,
      cancelled: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_packages: 0,
      total_ziyarats: 0,
    },
    Aug: {
      active: 0,
      completed: 0,
      cancelled: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_packages: 0,
      total_ziyarats: 0,
    },
    Sep: {
      active: 0,
      completed: 0,
      cancelled: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_packages: 0,
      total_ziyarats: 0,
    },
    Oct: {
      active: 0,
      completed: 0,
      cancelled: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_packages: 0,
      total_ziyarats: 0,
    },
    Nov: {
      active: 0,
      completed: 0,
      cancelled: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_packages: 0,
      total_ziyarats: 0,
    },
    Dec: {
      active: 0,
      completed: 0,
      cancelled: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_packages: 0,
      total_ziyarats: 0,
    },
  };

  try {
    const bookings = await db.booking.findAll({ raw: true });
    bookings.forEach((booking) => {
      const temp = moment.utc(booking.booking_date).tz(TIME_ZONE);
      if (temp.isBefore(tomorrow)) {
        monthlyBookings[temp.format("MMM")].total_bookings++;

        if (booking.booking_type === "package")
          monthlyBookings[temp.format("MMM")].total_packages++;

        if (booking.booking_type === "ziyarat")
          monthlyBookings[temp.format("MMM")].total_ziyarats++;

        if (booking.status === "cancelled")
          monthlyBookings[temp.format("MMM")].cancelled++;
        else if (booking.status === "complete") {
          monthlyBookings[temp.format("MMM")].total_revenue += parseFloat(
            booking.total_price
          );
          monthlyBookings[temp.format("MMM")].completed++;
        } else monthlyBookings[temp.format("MMM")].active++;
      }
    });

    return res.status(200).json({ data: monthlyBookings });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = { bookedCarsAnalytics, bookingAnalytics };
