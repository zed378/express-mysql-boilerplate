const express = require("express");
const router = express.Router();

const { contactUs } = require("../controller/mail");

router.post("/send", contactUs);

module.exports = router;
