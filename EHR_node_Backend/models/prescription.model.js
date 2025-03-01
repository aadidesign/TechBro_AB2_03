const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Using provided P1001 format (note: potential conflict)
  patient_id: {
    type: String,
    ref: 'Patient',
    required: true
  },
  doctor_id: {
    type: String,
    ref: 'MedicalStaff',
    required: true
  },
  medications: { type: [String], required: true },
  instructions: { type: String, required: true },
  date: { type: String, required: true }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);