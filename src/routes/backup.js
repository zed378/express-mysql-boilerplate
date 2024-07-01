const express = require("express");
const router = express.Router();

const {
  backup,
  restoreDataBackup,
  restoreLogBackup,
} = require("../controller/backup");

router.get("/start", backup);
router.get("/restore/data/:filename", restoreDataBackup);
router.get("/restore/log/:filename", restoreLogBackup);

module.exports = router;
