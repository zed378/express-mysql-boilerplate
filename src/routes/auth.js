const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  register,
  login,
  activation,
  sendOTP,
  resetPassword,
  verify,
} = require("../controller/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/activation", activation);
router.post("/otp", sendOTP);
router.post("/reset", resetPassword);
router.get("/verify", auth, verify);

module.exports = router;
