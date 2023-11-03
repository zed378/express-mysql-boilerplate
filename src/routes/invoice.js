const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  getAllInvoices,
  getInvoices,
  getInvoice,
  createInvoice,
} = require("../controller/invoice");

router.get("/all", auth, getAllInvoices);
router.get("/alls", auth, getInvoices);
router.get("/:id", auth, getInvoice);
router.post("/add", auth, createInvoice);

module.exports = router;
