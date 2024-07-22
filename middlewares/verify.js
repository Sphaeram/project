const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const { ACCESS_TOKEN_SECRET } = require("../utils/constants");
const db = require("../models");
const { Op } = require("sequelize");

config();

const verifyLogin = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token Expired!" });
    }

    req.user = decoded;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  await verifyLogin(req, res, () => {
    if (req.user.user_type_id === 6156) {
      next();
    } else {
      return res.sendStatus(403);
    }
  });
};

const verifyValidityForBooking = async (req, res, next) => {
  if (!req.user.id) return res.status(403).json({ data: "SigIn First!" });
  try {
    const bookingsCount = await db.booking.count({
      where: { user_id: req.user.id, status: { [Op.ne]: "complete" } },
    });
    if (bookingsCount > 0) {
      return res.status(403).json({ data: "You have an active booking!" });
    } else {
      next();
    }
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = { verifyLogin, verifyAdmin, verifyValidityForBooking };
