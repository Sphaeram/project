const express = require("express");
const { config } = require("dotenv");
const db = require("./models");
const routes = require("./routes/index");
const path = require("path");
const { customCorsOptions } = require("./config/cors");
const cors = require("cors");

config();

const app = express();
const PORT = process.env.PORT || 5000;

/******** MIDDLEWARES ********/

app.use(cors(customCorsOptions));

app.use(express.static(path.join(__dirname, "public")));

//* Validate JSON Body
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        return res.status(400).json({ message: "Please enter a valid JSON" });
      }
    },
  })
);

app.use(express.urlencoded({ extended: true }));

//* ROUTES
app.use("/", routes);

app.listen(PORT, () => {
  db.sequelize
    .authenticate()
    .then(() => console.log("Connected to databse!"))
    .catch(() => console.log("Database Connection Error!"));
  console.log(`Server is running on port ${PORT}`);
});
