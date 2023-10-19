const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { profileImg } = require("../middleware/upload");

const {
  updateUserName,
  updatePict,
  getAllUser,
  getUser,
  setIsActive,
} = require("../controller/user");

router.get("/all", auth, getAllUser);
router.get("/:id", getUser);
router.post("/username", auth, updateUserName);
router.post("/profile", auth, profileImg("picture"), updatePict);
router.post("/set-status", auth, setIsActive);

module.exports = router;
