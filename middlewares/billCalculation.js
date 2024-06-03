const db = require("../models");
const checkCoupon = require("../utils/checkCoupon");

module.exports = async (req, res, next) => {
  const body = req.body;
  req.info = {
    package_id: null,
    fare_id: null,
    car_id: null,
    coupon_id: null,
    discount: 0,
    subtotal: 0,
    total_price: 0,
  };

  if (!body.package_id && !body.fare_id) return res.status(400).json({ data: "Bad Request!" });
  if (body.package_id && body.fare_id)
    return res.status(403).json({ data: "Choose a package or a fixed fare!" });

  if (body.package_id) {
    if (isNaN(parseInt(body.package_id)))
      return res.status(400).json({ data: "Enter a valid Id!" });
    const package = await db.package.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: {
        id: parseInt(body.package_id),
      },
      include: {
        model: db.car,
        attributes: ["id"],
        through: {
          attributes: [],
        },
      },
    });
    if (!package) return res.status(404).json({ data: "Package not found!" });
    req.info.package_id = package.id;
    req.info.car_id = package.cars[0].id;
    req.info.subtotal = package.price;
  } else {
    if (isNaN(parseInt(body.fare_id))) return res.status(400).json({ data: "Enter a valid Id!" });
    if (!body.fare_type) return res.status(400).json({ data: "Bad Request!" });
    const fare = await db.fare.findOne({
      attributes: ["id", "location_type", "car_id", "fare"],
      where: { id: parseInt(body.fare_id), location_type: body.fare_type.toLowerCase() },
    });
    req.info.fare_id = fare.id;
    req.info.car_id = fare.car_id;
    req.info.subtotal = fare.fare;
  }
  if (body.code) {
    const coupon = await checkCoupon(req.user.id, body.code);
    req.info.coupon_id = coupon.id;
    req.info.discount = coupon.discount;
  }
  req.info.total_price = parseFloat((req.info.subtotal - req.info.discount).toFixed(2));
  next();
};
