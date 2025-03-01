const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Using provided T1001 format
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
  test_name: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  resultFile: { type: String, default: null }
});

module.exports = mongoose.model('LabTest', labTestSchema);