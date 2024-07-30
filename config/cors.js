const { config } = require("dotenv");

config();

const customCorsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = { customCorsOptions };
