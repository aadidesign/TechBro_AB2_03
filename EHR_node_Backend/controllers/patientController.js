const fs = require("fs");
const path = require("path");

const patientsFile = path.join(__dirname, "../data/patients.json");

const getPatients = (req, res) => {
  if (!fs.existsSync(patientsFile)) return [];
  const data = fs.readFileSync(patientsFile);
  return JSON.parse(data);
};

exports.getPatients = (req, res) => {
  const patients = getPatients();
  res.json(patients);
}

const savePatients = (data) => {
  console.log(data);
  
  fs.writeFileSync(patientsFile, JSON.stringify(data, null, 2));
};

// Get all patients
exports.getAllPatients = (req, res) => {
  const patients = getPatients();
  res.render("patients", { patients });
};

// Add a new patient
exports.addPatient = (req, res) => {
  console.log(req.body);
  const patients = getPatients();
  const { name, age, gender, contact } = req.body;
  
  const newPatient = { id: Date.now(), name, age, gender, contact };
  patients.push(newPatient);
  savePatients(patients);
  res.redirect("/patient");
};

// Delete a patient
exports.deletePatient = (req, res) => {
  let patients = getPatients();
  patients = patients.filter((p) => p.id !== parseInt(req.params.id));
  savePatients(patients);
  res.redirect("/patient");
};