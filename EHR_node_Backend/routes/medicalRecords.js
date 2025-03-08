const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const auth = require('../middleware/auth');

// Get all medical records (with pagination and filters)
router.get('/', auth, medicalRecordController.getAllRecords);

// Search medical records
router.get('/search', auth, medicalRecordController.searchRecords);

// Get medical records for a specific patient
router.get('/patient/:patientId', auth, medicalRecordController.getPatientRecords);

// Get specific medical record by ID
router.get('/:id', auth, medicalRecordController.getRecordById);

// Create new medical record
router.post('/', auth, medicalRecordController.createRecord);

// Update medical record
router.put('/:id', auth, medicalRecordController.updateRecord);

// Delete medical record
router.delete('/:id', auth, medicalRecordController.deleteRecord);

module.exports = router;
