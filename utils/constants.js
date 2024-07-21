require("dotenv").config();

const TIME_ZONE = "Asia/Riyadh";
const PORT = process.env.PORT || 5000;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

module.exports = { TIME_ZONE, PORT, ACCESS_TOKEN_SECRET };
