const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

// Get all patients with optional filtering and sorting
router.get("/", patientController.getAllPatients);

// Get patient statistics
router.get("/stats", patientController.getPatientStats);

// Get a single patient
router.get("/:id", patientController.getPatientById);

// Add a new patient
router.post("/", patientController.addPatient);

// Update a patient
router.put("/:id", patientController.updatePatient);

// Delete a patient
router.delete("/:id", patientController.deletePatient);

module.exports = router;
