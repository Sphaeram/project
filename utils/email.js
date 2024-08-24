const nodemailer = require("nodemailer");
const { MAIL_SENDING_EMAIL, MAIL_SENDING_PASSWORD } = require("./constants");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_SENDING_EMAIL,
    pass: MAIL_SENDING_PASSWORD,
  },
  // tls: {
  //   rejectUnauthorized: false,
  // },
});

module.exports = { transporter };
