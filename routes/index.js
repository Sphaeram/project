const router = require("express").Router();
const authRouter = require("./authRoutes");
const adminRouter = require("./admin/index");
const { verifyAdmin } = require("../middlewares/verify");

router.get("/", (req, res) => res.status(200).send("<center><h1>Welcome!</h1></center>"));

router.use("/auth", authRouter);
router.use("/admin", verifyAdmin, adminRouter);

module.exports = router;
