const express = require("express");
const router = express.Router();

const {
  getAllService,
  getService,
  getServicesByCategory,
  createService,
  editService,
  deleteService,
} = require("../controller/service");

router.get("/all", getAllService);
router.get("/:id", getService);
router.post("/category", getServicesByCategory);
router.post("/add", createService);
router.patch("/edit", editService);
router.delete("/:id", deleteService);

module.exports = router;
