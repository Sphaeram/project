const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "public/images";

    if (req.destination === "airport") folder = "public/images/airport";

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fields = [{ name: "airport_image", maxCount: 1 }];

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
