const express = require("express");
const router = express.Router();
const { getPage } = require("../controllers/page");

router.route("/:id").get(getPage);

module.exports = router;
