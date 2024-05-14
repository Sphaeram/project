const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();

const verifyLogin = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
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

module.exports = { verifyLogin, verifyAdmin };
