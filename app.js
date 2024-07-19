const express = require("express");
const { config } = require("dotenv");
const db = require("./models");
const routes = require("./routes/index");
const path = require("path");
const { customCorsOptions } = require("./config/cors");
const cors = require("cors");
const morgan = require("morgan");

config();

const app = express();
const PORT = process.env.PORT || 5000;

/******** MIDDLEWARES ********/

app.use(morgan("dev"));

app.use(cors(customCorsOptions));

app.use(express.static(path.join(__dirname, "public")));

//   const imagePath = path.join(__dirname, "public/images", req.path);

//   if (!fs.existsSync(imagePath)) return next();

//   const ext = path.extname(imagePath).toLowerCase();
//   if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") return next();

//   try {
//     const data = fs.readFileSync(imagePath);
//     const processedImage = await sharp(data).toBuffer();
//     return res.type(`image/${ext.slice(1)}`).send(processedImage);
//   } catch (err) {
//     return res.status(500).send("Error processing image.");
//   }
// });

app.use("/testing", (req, res) => res.status(200).send("<center><h1>Testing...</h1></center>"));

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
