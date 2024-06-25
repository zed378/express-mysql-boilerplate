const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  getProducts,
  createProduct,
  getProduct,
} = require("../controller/product");

router.post("/all", getProducts);
router.post("/view", getProduct);
router.post("/add", auth, createProduct);

module.exports = router;
