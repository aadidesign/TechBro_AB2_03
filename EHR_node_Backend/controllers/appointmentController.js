const Appointment = require('../models/appointment.model');
const Patient = require('../models/patient.model');
const MedicalStaff = require('../models/medicalStaff.model');

// Get all appointments with populated data
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient_id', 'name')
      .populate('doctor_id', 'name');
    res.render("appointments", { appointments });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Schedule new appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, date, time, reason } = req.body;
    
    // Validate existence
    const [patient, doctor] = await Promise.all([
      Patient.findById(patient_id),
      MedicalStaff.findById(doctor_id)
    ]);

    if (!patient || !doctor) {
      return res.status(404).send('Patient or Doctor not found');
    }

    const newAppointment = new Appointment({
      patient_id,
      doctor_id,
      date,
      time,
      reason
    });

    await newAppointment.save();
    res.redirect("/appointment");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.redirect("/appointment");
  } catch (error) {
    res.status(500).send(error.message);
  }
};