const express = require("express");
const router = express.Router();

const { getAllStatus } = require("../controller/status");

router.get("/all", getAllStatus);

module.exports = router;
