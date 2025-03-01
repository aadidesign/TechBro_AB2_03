const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Using provided A1001 format
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
  date: { type: String, required: true },
  time: { type: String, required: true },
  reason: { type: String, required: true }
});

module.exports = mongoose.model('Appointment', appointmentSchema);