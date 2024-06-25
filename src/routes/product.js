const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product");

router.post("/all", getProducts);
router.post("/view", getProduct);
router.post("/add", auth, createProduct);
router.patch("/edit", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
