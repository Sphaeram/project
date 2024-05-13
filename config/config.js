const { config } = require("dotenv");

config();

module.exports = {
  development: {
    username: process.env.SQL_USER_DEV,
    password: process.env.SQL_PASSWORD_DEV,
    database: process.env.SQL_DATABASE_DEV,
    host: process.env.SQL_HOST_DEV,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.SQL_USER_PROD,
    password: process.env.SQL_PASSWORD_PROD,
    database: process.env.SQL_DATABASE_PROD,
    host: process.env.SQL_HOST_PROD,
    dialect: "mysql",
    logging: false,
  },
};
