const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  getAllCompany,
  getCompanies,
  getCompany,
  createCompany,
  editCompany,
  deleteCompany,
} = require("../controller/company");

router.get("/all", auth, getAllCompany);
router.get("/alls", auth, getCompanies);
router.get("/:id", auth, getCompany);
router.post("/add", auth, createCompany);
router.patch("/edit", auth, editCompany);
router.delete("/del/:id", auth, deleteCompany);

module.exports = router;
