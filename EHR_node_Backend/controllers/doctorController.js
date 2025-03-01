const MedicalStaff = require('../models/medicalStaff.model');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await MedicalStaff.find({ role: 'Doctor' });
    res.render("doctors", { doctors });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Add new doctor
exports.addDoctor = async (req, res) => {
  try {
    const { name, specialization, availability } = req.body;
    
    const newDoctor = new MedicalStaff({
      name,
      role: 'Doctor',
      specialization,
      availability: availability || '9 AM - 5 PM'
    });

    await newDoctor.save();
    res.redirect("/doctor");
  } catch (error) {
    res.status(500).send(error.message);
  }
};