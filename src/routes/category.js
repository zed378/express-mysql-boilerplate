const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  getAllCategories,
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category");

router.post("/alls", getAllCategories);
router.get("/all", getCategories);
router.get("/:id", getCategory);
router.post("/add", auth, createCategory);
router.patch("/edit", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

module.exports = router;
