const Prescription = require('../models/prescription.model');
const Patient = require('../models/patient.model');
const MedicalStaff = require('../models/medicalStaff.model');

// Get all prescriptions with populated data
exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient_id', 'name')
      .populate('doctor_id', 'name')
      .sort({ date: -1 });

    res.render("prescriptions", { prescriptions });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Add new prescription
exports.addPrescription = async (req, res) => {
  try {
    const { patient_id, doctor_id, medications, instructions } = req.body;
    
    // Validate existence
    const [patient, doctor] = await Promise.all([
      Patient.findById(patient_id),
      MedicalStaff.findById(doctor_id)
    ]);

    if (!patient || !doctor) {
      return res.status(404).send('Patient or Doctor not found');
    }

    // Generate prescription ID
    const lastPrescription = await Prescription.findOne().sort({ _id: -1 });
    const newId = lastPrescription ? 
      `PR${parseInt(lastPrescription._id.slice(2)) + 1}` : 'PR1001';

    const newPrescription = new Prescription({
      _id: newId,
      patient_id,
      doctor_id,
      medications: Array.isArray(medications) ? medications : [medications],
      instructions,
      date: new Date().toISOString().split('T')[0]
    });

    await newPrescription.save();
    res.redirect("/prescription");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Additional useful functions
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient_id')
      .populate('doctor_id');

    if (!prescription) return res.status(404).send('Prescription not found');
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.redirect("/prescription");
  } catch (error) {
    res.status(500).send(error.message);
  }
};