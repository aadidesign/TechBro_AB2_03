const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Using provided R1001 format
  patient_id: {
    type: String,
    ref: 'Patient',
    required: true
  },
  diagnosis: { type: String, required: true },
  medications: { type: [String], default: [] },
  allergies: { type: [String], default: [] },
  lab_reports: { type: String },
  date: { type: String, required: true }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);