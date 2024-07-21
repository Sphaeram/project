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
  let totalBookings = 0,
    totalRevenue = 0;

  const tomorrow = moment().tz(TIME_ZONE).add(1, "day").startOf("day");
  console.log(tomorrow);
  console.log(moment().tz(TIME_ZONE).add(2, "day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"));
  try {
    const bookings = await db.booking.findAll({ raw: true });

    bookings.forEach((booking) => {
      if (moment.utc(booking.booking_date).tz(TIME_ZONE).isBefore(tomorrow)) {
        totalBookings++;
        totalRevenue += parseFloat(booking.total_price);
      }
    });

    const analytics = {
      totalBookings,
      totalRevenue,
    };
    return res.status(200).json({ data: analytics });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = { bookedCarsAnalytics, bookingAnalytics };
