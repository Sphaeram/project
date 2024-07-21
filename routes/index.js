const router = require("express").Router();
const authRouter = require("./authRoutes");
const websiteRouter = require("./website/index");
const adminRouter = require("./admin/index");

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/", websiteRouter);

module.exports = router;
