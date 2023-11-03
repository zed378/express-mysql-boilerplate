const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  getAllApproach,
  getAllUserApproach,
  filteredApproach,
  getApproach,
  createApproach,
  editApproach,
  deleteApproach,
  changeStatus,
} = require("../controller/approach");

router.get("/all", auth, getAllApproach);
router.get("/user/all", auth, getAllUserApproach);
router.get("/filtered", auth, filteredApproach);
router.get("/:id", auth, getApproach);
router.post("/add", auth, createApproach);
router.patch("/edit", auth, editApproach);
router.delete("/del/:id", auth, deleteApproach);
router.patch("/edit-status", auth, changeStatus);

module.exports = router;
