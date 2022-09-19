const express = require("express");
const router = express.Router();
const { updateWriting, getWriting } = require("../controllers/editor");

router.route("/").get(getWriting).post(updateWriting);

module.exports = router;
