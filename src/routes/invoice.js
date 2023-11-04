const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  getAllInvoices,
  getInvoices,
  getInvoice,
  createInvoice,
  editInvoice,
  deleteInvoice,
} = require("../controller/invoice");

router.get("/all", auth, getAllInvoices);
router.get("/alls", auth, getInvoices);
router.get("/:id", auth, getInvoice);
router.post("/add", auth, createInvoice);
router.patch("/edit", auth, editInvoice);
router.delete("/del", auth, deleteInvoice);

module.exports = router;
