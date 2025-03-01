const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");

router.get("/", doctorController.getAllDoctors);
router.post("/add", doctorController.addDoctor);

module.exports = router;
