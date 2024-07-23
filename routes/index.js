const router = require("express").Router();
const authRouter = require("./authRoutes");
const websiteRouter = require("./website/index");
const adminRouter = require("./admin/index");
const rideRouter = require("./rideRoutes");
const reviewRouter = require("./reviewRoutes");

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/rides", rideRouter);
router.use("/reviews", reviewRouter);
router.use("/", websiteRouter);

module.exports = router;
