const express = require("express");

const router = express.Router();

const {
  migrate,
  dropTable,
  seeding,
  unseeding,
  deactiveAll,
  activateAll,
} = require("../controller/migration");

router.get("/up", migrate);
router.get("/down", dropTable);
router.get("/seeding", seeding);
router.get("/unseeding", unseeding);
router.get("/deactive", deactiveAll);
router.get("/activate", activateAll);

module.exports = router;
