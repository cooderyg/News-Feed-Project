const express = require("express");
const router = express.Router();

const placesRouter = require("./routes/places.route");

router.use("/places,placesRoute");
module.exports = router;
