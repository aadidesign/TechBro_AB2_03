const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Using provided P1001 format
  name: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  blood_type: { type: String },
  diagnoses: { type: [String], default: [] },
  medications: { type: [String], default: [] },
  allergies: { type: [String], default: [] },
  last_visit: { type: String },
  condition: { type: String },
  aiSupportResponse: { type: String, default: "" }
});

module.exports = mongoose.model('Patient', patientSchema);