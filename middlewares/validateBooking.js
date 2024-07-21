const db = require("../models");
const checkCoupon = require("../utils/checkCoupon");
const { sanitizeFields } = require("../utils/otherUtils");

const validateBooking = async (req, res, next) => {
  let booking_type = "",
    bookingId = "",
    foundCarId = 0,
    price = 0;
  const sanitizedFields = sanitizeFields(
    ["car_id", "booking_type", "booking_type_id", "pickup_point", "drop_point", "coupon"],
    req.body
  );

  if (isNaN(sanitizedFields.car_id)) return res.status(400).json({ message: "Bad Request!" });

  try {
    const car = await db.car.findByPk(sanitizedFields.car_id, { raw: true });
    if (!car) return res.status(404).json({ data: "No Car Found!" });
    if (car.booked) return res.status(403).json({ data: "Car is already booked!" });

    switch (sanitizedFields.booking_type?.toLowerCase()) {
      case "ziyarat":
        booking_type = await db.category.findByPk(sanitizedFields.booking_type_id, {
          include: [{ model: db.sub_category, attributes: ["ziyarat_points"] }],
        });
        if (!booking_type) return res.status(404).json({ data: "Ziyarat Not Found!" });
        foundCarId = booking_type.car_id;
        price = booking_type.price;
        sanitizedFields.pickup_point = null;
        sanitizedFields.drop_point = null;
        bookingId = "SFCZ-";
        break;

      case "package":
        booking_type = await db.package.findByPk(sanitizedFields.booking_type_id, {
          include: { model: db.car, through: { attributes: ["price"] } },
        });
        if (!booking_type) return res.status(404).json({ data: "Package Not Found!" });
        booking_type?.cars.forEach((car) => {
          if (car.id === sanitizedFields.car_id) {
            foundCarId = car.id;
            price = car.car_package.price;
          }
        });
        bookingId = "SFCP-";
        break;

      case "airport":
        booking_type = await db.airport_fare.findByPk(sanitizedFields.booking_type_id);
        if (!booking_type) return res.status(404).json({ data: "Airport Not Found!" });
        foundCarId = booking_type.car_id;
        price = booking_type.fare;
        sanitizedFields.pickup_point = booking_type.pickup_location;
        sanitizedFields.drop_point = booking_type.drop_location;
        bookingId = "SFCA-";
        break;

      case "railway":
        booking_type = await db.railway_fare.findByPk(sanitizedFields.booking_type_id);
        if (!booking_type) return res.status(404).json({ data: "Railway Station Not Found!" });
        foundCarId = booking_type.car_id;
        price = booking_type.fare;
        sanitizedFields.pickup_point = booking_type.pickup_location;
        sanitizedFields.drop_point = booking_type.drop_location;
        bookingId = "SFCR-";
        break;

      default:
        return res.status(400).json({ data: "No booking type found!" });
    }

    if (parseInt(sanitizedFields.car_id) !== foundCarId)
      return res
        .status(403)
        .json({ data: "The selected car is not assigned to the selected booking type!" });

    if (sanitizedFields.coupon && sanitizedFields.coupon !== "") {
      const couponResult = await checkCoupon(req.user.id, sanitizedFields.coupon);
      if (couponResult.status && couponResult.message)
        return res.status(couponResult.status).json({ data: couponResult.message });
      req.coupon = couponResult;
    }

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
      discount: req.coupon?.id ? parseFloat(req.coupon?.discount) : 0,
      total_price: parseFloat(price) - parseFloat(req.coupon?.discount),
    };

    req.sanitizedFields = bookingData;

    next();
  } catch (error) {
    return res.status(500).json({ data: "Internal Server Error!" });
  }
};

module.exports = { validateBooking };
