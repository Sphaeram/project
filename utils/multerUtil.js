const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "public/images";

    if (req.destination === "airport") folder = "public/images/airport";
    if (req.destination === "hotel") folder = "public/images/hotel";
    if (req.destination === "railway_station") folder = "public/images/railway_station";
    if (req.destination === "car") folder = "public/images/car";
    if (req.destination === "category") folder = "public/images/category";
    if (req.destination === "sub_category") folder = "public/images/sub_category";

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fields = [
  { name: "airport_image", maxCount: 1 },
  { name: "hotel_image", maxCount: 1 },
  { name: "railway_station_image", maxCount: 1 },
  { name: "car_image", maxCount: 1 },
  { name: "category_image", maxCount: 1 },
  { name: "sub_category_image", maxCount: 1 },
];

const upload = multer({
  storage: storage,
}).fields(fields);

const handlingMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer error: File limit exceeded
    if (err.code === "LIMIT_UNEXPECTED_FILE")
      return res.status(400).json({ data: "File limit exceeded" });
    else return res.status(500).json({ data: "Internal Server Error! Please try again later" });
  } else {
    next();
  }
};

module.exports = { upload, handlingMulterError };
