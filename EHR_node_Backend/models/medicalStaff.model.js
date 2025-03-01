const mongoose = require('mongoose');

const medicalStaffSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Using provided D1001/S2001 format
  name: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['Doctor', 'Nurse', 'Receptionist'] 
  },
  specialization: { type: String, default: 'N/A' },
  availability: { type: String }
});

module.exports = mongoose.model('MedicalStaff', medicalStaffSchema);