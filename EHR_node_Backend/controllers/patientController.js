const Patient = require('../models/patient.model');

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.render("patients", { patients });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get single patient with related data
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('appointments')
      .populate('prescriptions');

    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new patient
exports.addPatient = async (req, res) => {
  try {
    // Generate custom ID
    const lastPatient = await Patient.findOne().sort({ _id: -1 });
    const newId = lastPatient ? 
      `P${parseInt(lastPatient._id.slice(1)) + 1}` : 'P1001';

    const newPatient = new Patient({
      _id: newId,
      ...req.body,
      last_visit: new Date().toISOString().split('T')[0],
      condition: "Stable",
      aiSupportResponse: ""
    });

    await newPatient.save();
    res.redirect("/patient");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update AI response
exports.updatePatientAIResponse = async (id, response) => {
  try {
    await Patient.findByIdAndUpdate(id, { aiSupportResponse: response });
  } catch (error) {
    console.error('Error updating AI response:', error);
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.redirect("/patient");
  } catch (error) {
    res.status(500).send(error.message);
  }
};