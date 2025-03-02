const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

router.get("/", patientController.getAllPatients);
router.get("/get", patientController.getPatients);
router.post("/add", patientController.addPatient);
router.get("/delete/:id", patientController.deletePatient);

module.exports = router;
