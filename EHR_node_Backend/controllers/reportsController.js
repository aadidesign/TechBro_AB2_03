const fs = require("fs");
const path = require("path");

const getData = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
};

// Get reports data
exports.getReports = (req, res) => {
  const patients = getData(path.join(__dirname, "../data/patients.json"));
  const appointments = getData(path.join(__dirname, "../data/appointments.json"));
  const doctors = getData(path.join(__dirname, "../data/doctors.json"));

  res.render("reports", {
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    totalDoctors: doctors.length,
  });
};
