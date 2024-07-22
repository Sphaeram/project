const router = require("express").Router();
const authRouter = require("./authRoutes");
const websiteRouter = require("./website/index");
const adminRouter = require("./admin/index");
const rideRouter = require("./rideRoutes");

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/rides", rideRouter);
router.use("/", websiteRouter);

module.exports = router;
