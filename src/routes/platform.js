const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  getAllPlatform,
  getPlatforms,
  getPlatform,
  createPlatform,
  editPlatform,
  deletePlatform,
} = require("../controller/platform");

router.get("/all", auth, getAllPlatform);
router.get("/alls", auth, getPlatforms);
router.get("/:id", auth, getPlatform);
router.post("/add", auth, createPlatform);
router.patch("/edit", auth, editPlatform);
router.delete("/del/:id", auth, deletePlatform);

module.exports = router;
