const fs = require("fs");
const path = require("path");

const doctorsFile = path.join(__dirname, "../data/doctors.json");

const getDoctors = () => {
  if (!fs.existsSync(doctorsFile)) return [];
  return JSON.parse(fs.readFileSync(doctorsFile));
};

const saveDoctors = (data) => {
  fs.writeFileSync(doctorsFile, JSON.stringify(data, null, 2));
};

// Get all doctors
exports.getAllDoctors = (req, res) => {
  const doctors = getDoctors();
  res.render("doctors", { doctors });
};

// Add a new doctor
exports.addDoctor = (req, res) => {
  const doctors = getDoctors();
  const { name, specialization } = req.body;
  const newDoctor = { id: Date.now(), name, specialization };
  doctors.push(newDoctor);
  saveDoctors(doctors);
  res.redirect("/doctor");
};
