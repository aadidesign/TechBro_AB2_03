const Patient = require('../models/patient.model');
const Appointment = require('../models/appointment.model');
const MedicalStaff = require('../models/medicalStaff.model');

// Get aggregated reports data
exports.getReports = async (req, res) => {
  try {
    const [totalPatients, totalAppointments, totalDoctors] = await Promise.all([
      Patient.countDocuments(),
      Appointment.countDocuments(),
      MedicalStaff.countDocuments({ role: 'Doctor' })
    ]);

    // Get recent 5 appointments
    const recentAppointments = await Appointment.find()
      .populate('patient_id', 'name')
      .populate('doctor_id', 'name')
      .sort({ date: -1 })
      .limit(5);

    res.render("reports", {
      totalPatients,
      totalAppointments,
      totalDoctors,
      recentAppointments
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Additional report functions
exports.getPatientStatistics = async (req, res) => {
  try {
    const stats = await Patient.aggregate([
      {
        $group: {
          _id: null,
          averageAge: { $avg: { $toInt: "$age" } },
          totalMale: { $sum: { $cond: [{ $eq: ["$gender", "Male"] }, 1, 0] } },
          totalFemale: { $sum: { $cond: [{ $eq: ["$gender", "Female"] }, 1, 0] } }
        }
      }
    ]);
    
    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};