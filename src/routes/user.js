const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { profileImg } = require("../middleware/upload");

const {
  updateUserName,
  updatePict,
  getAllUser,
  filterdUserByRole,
  getUser,
  setIsActive,
  updateUserFullName,
  deleteUser,
} = require("../controller/user");

router.get("/all", auth, getAllUser);
router.post("/filtered", auth, filterdUserByRole);
router.get("/:id", auth, getUser);
router.post("/username", auth, updateUserName);
router.post("/profile", auth, profileImg("picture"), updatePict);
router.post("/set-status", auth, setIsActive);
router.patch("/name", auth, updateUserFullName);
router.delete("/:id", auth, deleteUser);

module.exports = router;
