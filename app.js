const express = require("express");
const { config } = require("dotenv");
const db = require("./models");
const routes = require("./routes/index");
const path = require("path");
const { customCorsOptions } = require("./config/cors");
const cors = require("cors");
const morgan = require("morgan");
const { PORT } = require("./utils/constants");

config();

const app = express();

/******** MIDDLEWARES ********/

app.use(morgan("dev"));

app.use(cors(customCorsOptions));

app.use(express.static(path.join(__dirname, "public")));

app.use("/testing", (req, res) => res.status(200).send("<center><h1>Testing...</h1></center>"));

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
