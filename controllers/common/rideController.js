const db = require("../../models");

const getPickupPoints = async (req, res) => {
  const { carId } = req.query;
  if (!carId || isNaN(carId))
    return res.status(400).json({ data: "Bad Request!" });

  try {
    const airports = await db.airport_fare.findAll({
      attributes: ["pickup_location"],
      where: { car_id: carId },
      raw: true,
    });
    const railways = await db.railway_fare.findAll({
      attributes: ["pickup_location"],
      where: { car_id: carId },
      raw: true,
    });

    const pickupPoints = [
      ...new Set([
        ...airports.map((airport) => airport.pickup_location),
        ...railways.map((railway) => railway.pickup_location),
      ]),
    ];

    return res.status(200).json({ data: pickupPoints });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

const getDropPoints = async (req, res) => {
  const { pickupPoint, carId } = req.query;
  if (!pickupPoint) return res.status(400).json({ data: "Bad Request!" });

  try {
    const airports = await db.airport_fare.findAll({
      attributes: ["drop_location", "fare"],
      where: { pickup_location: pickupPoint, car_id: carId },
      raw: true,
    });
    const railways = await db.railway_fare.findAll({
      attributes: ["drop_location", "fare"],
      where: { pickup_location: pickupPoint, car_id: carId },
      raw: true,
    });

    const dropPoints = [
      ...airports.map((airport) => ({
        drop_point: airport.drop_location,
        fare: airport.fare,
      })),
      ...railways.map((railway) => ({
        drop_point: railway.drop_location,
        fare: railway.fare,
      })),
    ];

    return res.status(200).json({ data: dropPoints });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = { getPickupPoints, getDropPoints };
