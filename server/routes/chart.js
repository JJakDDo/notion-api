const express = require("express");
const router = express.Router();
const { generateChart } = require("../controllers/chart");

router.route("/generate").get(generateChart);

module.exports = router;
