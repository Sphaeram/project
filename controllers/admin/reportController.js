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
  const initializeMonthlyBookings = () => ({
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
  });

  try {
    const bookings = await db.booking.findAll({ raw: true });
    const yearlyBookings = {};

    bookings.forEach((booking) => {
      const temp = moment.utc(booking.booking_date).tz(TIME_ZONE);
      if (temp.isBefore(tomorrow)) {
        const year = temp.format("YYYY");
        const month = temp.format("MMM");

        if (!yearlyBookings[year]) {
          yearlyBookings[year] = initializeMonthlyBookings();
        }

        yearlyBookings[year][month].total_bookings++;

        if (booking.booking_type === "package")
          yearlyBookings[year][month].total_packages++;

        if (booking.booking_type === "ziyarat")
          yearlyBookings[year][month].total_ziyarats++;

        if (booking.status === "cancelled")
          yearlyBookings[year][month].cancelled++;
        else if (booking.status === "complete") {
          yearlyBookings[year][month].total_revenue += parseFloat(
            booking.total_price
          );
          yearlyBookings[year][month].completed++;
        } else yearlyBookings[year][month].active++;
      }
    });
    let data = "";
    if (Object.keys(yearlyBookings).length === 0) {
      data = {
        2024: {
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
        },
      };
    } else {
      data = yearlyBookings;
    }

    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = { bookedCarsAnalytics, bookingAnalytics };
