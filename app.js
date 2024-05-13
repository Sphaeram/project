const express = require("express");
const { config } = require("dotenv");
const db = require("./models");

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  db.sequelize
    .authenticate()
    .then(() => console.log("Connected to databse!"))
    .catch(() => console.log("Database Connection Error!"));
  console.log(`Server is running on port ${PORT}`);
});
