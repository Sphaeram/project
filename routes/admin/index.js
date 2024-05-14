const router = require("express").Router();
const airportRouter = require("./airportRoutes");

router.use("/airports", airportRouter);

module.exports = router;
