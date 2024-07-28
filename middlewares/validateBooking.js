const db = require("../models");
const checkCoupon = require("../utils/checkCoupon");
const { sanitizeFields } = require("../utils/otherUtils");

const validateBooking = async (req, res, next) => {
  let booking_type = "",
    bookingId = "",
    foundCarId = 0,
    price = 0,
    discount = 0;

  const sanitizedFields = sanitizeFields(
    [
      "car_id",
      "booking_type",
      "booking_type_id",
      "pickup_point",
      "drop_point",
      "coupon",
      "fare",
    ],
    req.body
  );

  if (isNaN(sanitizedFields.car_id))
    return res.status(400).json({ message: "Bad Request!" });

  try {
    const car = await db.car.findByPk(sanitizedFields.car_id, { raw: true });
    if (!car) return res.status(404).json({ data: "No Car Found!" });
    if (car.booked)
      return res.status(403).json({ data: "Car is already booked!" });

    switch (sanitizedFields.booking_type?.toLowerCase()) {
      case "ziyarat":
        booking_type = await db.category.findByPk(
          sanitizedFields.booking_type_id,
          {
            include: [
              { model: db.sub_category, attributes: ["ziyarat_points"] },
            ],
          }
        );
        if (!booking_type)
          return res.status(404).json({ data: "Ziyarat Not Found!" });
        foundCarId = booking_type.car_id;
        price = booking_type.price;
        sanitizedFields.pickup_point = null;
        sanitizedFields.drop_point = null;
        bookingId = "SFCZ-";
        break;

      case "package":
        booking_type = await db.package.findByPk(
          sanitizedFields.booking_type_id,
          {
            include: { model: db.car, through: { attributes: ["price"] } },
          }
        );
        if (!booking_type)
          return res.status(404).json({ data: "Package Not Found!" });
        booking_type?.cars.forEach((car) => {
          if (car.id === sanitizedFields.car_id) {
            foundCarId = car.id;
            price = car.car_package.price;
          }
        });
        sanitizedFields.pickup_point = null;
        sanitizedFields.drop_point = null;
        bookingId = "SFCP-";
        break;

      case "ride":
        if (isNaN(sanitizedFields.fare))
          return res.status(403).json({ data: "The fare is not valid!" });
        const ride1 = await db.airport_fare.findAll({
          where: {
            car_id: sanitizedFields.car_id,
            fare: sanitizedFields.fare,
            pickup_location: sanitizedFields.pickup_point,
            drop_location: sanitizedFields.drop_point,
          },
          raw: true,
        });
        const ride2 = await db.railway_fare.findAll({
          where: {
            car_id: sanitizedFields.car_id,
            fare: sanitizedFields.fare,
            pickup_location: sanitizedFields.pickup_point,
            drop_location: sanitizedFields.drop_point,
          },
          raw: true,
        });
        const rides = [...ride1, ...ride2];
        if (rides.length === 0)
          return res.status(404).json({ data: "Ride Not Found!" });
        price = rides[0].fare;
        sanitizedFields.pickup_point = rides[0].pickup_location;
        sanitizedFields.drop_point = rides[0].drop_location;
        foundCarId = rides[0].car_id;
        bookingId = "SFCR-";
        break;

      default:
        return res.status(400).json({ data: "No booking type found!" });
    }

    if (parseInt(sanitizedFields.car_id) !== foundCarId)
      return res.status(403).json({
        data: "The selected car is not assigned to the selected booking type!",
      });

    if (sanitizedFields.coupon && sanitizedFields.coupon !== "") {
      const couponResult = await checkCoupon(
        req.user.id,
        sanitizedFields.coupon
      );
      if (couponResult.status && couponResult.message)
        return res
          .status(couponResult.status)
          .json({ data: couponResult.message });
      req.coupon = couponResult;
    }

    if (req.coupon?.id) discount = parseFloat(req.coupon?.discount);

    const bookingData = {
      booking_id: bookingId + req.user.id,
      user_id: req.user.id,
      car_id: sanitizedFields.car_id,
      booking_type: sanitizedFields.booking_type,
      booking_type_id: sanitizedFields.booking_type_id,
      pickup_point: sanitizedFields.pickup_point,
      drop_point: sanitizedFields.drop_point,
      coupon: req.coupon?.id ? sanitizedFields.coupon : "",
      sub_total: parseFloat(price),
      discount: discount,
      total_price: parseFloat(price) - parseFloat(discount),
    };

    req.sanitizedFields = bookingData;

    next();
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = { validateBooking };
