const express = require("express");
const router = express.Router();
const medicalRecordController = require("../controllers/medicalRecordController");

router.get("/", medicalRecordController.getAllRecords);
router.post("/add", medicalRecordController.addRecord);

module.exports = router;
