const { config } = require("dotenv");

config();

const customCorsOptions = {
  // origin: (origin, callback) => {
  //   const allowedOrigins = process?.env?.CORS_ORIGINS.split(" ");
  //   if (allowedOrigins?.indexOf(origin) !== -1) callback(null, true);
  //   else callback(new Error("Request from unauthorized origin"));
  // },
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = { customCorsOptions };
