const express = require("express");
const router = express.Router();

const { backup } = require("../controller/backup");

router.get("/start", backup);

module.exports = router;
