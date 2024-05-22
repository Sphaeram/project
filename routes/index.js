const router = require("express").Router();
const authRouter = require("./authRoutes");
const websiteRouter = require("./website/index");
const adminRouter = require("./admin/index");
const { verifyAdmin } = require("../middlewares/verify");

router.use("/auth", authRouter);
router.use("/admin", verifyAdmin, adminRouter);
router.use("/", websiteRouter);

module.exports = router;
