require("dotenv").config();

const TIME_ZONE = "Asia/Riyadh";
const PORT = process.env.PORT || 5000;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const MAIL_SENDING_EMAIL = process.env.MAIL_SENDING_EMAIL;
const MAIL_SENDING_PASSWORD = process.env.MAIL_SENDING_PASSWORD;

module.exports = {
  TIME_ZONE,
  PORT,
  ACCESS_TOKEN_SECRET,
  MAIL_SENDING_EMAIL,
  MAIL_SENDING_PASSWORD,
};
