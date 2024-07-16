const db = require("../../models/index");

module.exports = {
  bookedCarsAnalytics: async (req, res) => {
    return res.json("ok");
    try {
      const bookedCars = await db.booking.count({ where: { booking_status: "booked" }, raw: true });
      return res.status(200).json({ data: bookedCars });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
