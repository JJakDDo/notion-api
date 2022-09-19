const express = require("express");
const router = express.Router();
const { signUp, login, googleOTPAuth } = require("../controllers/auth");

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/verify").post(googleOTPAuth);

module.exports = router;
