const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescriptionController");

router.get("/", prescriptionController.getAllPrescriptions);
router.post("/add", prescriptionController.addPrescription);

module.exports = router;
