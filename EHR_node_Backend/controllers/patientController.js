const fs = require("fs");
const path = require("path");

const patientsFile = path.join(__dirname, "../data/patients.json");

const getPatients = () => {
  if (!fs.existsSync(patientsFile)) return [];
  return JSON.parse(fs.readFileSync(patientsFile));
};

const savePatients = (data) => {
  fs.writeFileSync(patientsFile, JSON.stringify(data, null, 2));
};

// Get all patients
exports.getAllPatients = (req, res) => {
  const patients = getPatients();
  res.render("patients", { patients });
};

// Get single patient
exports.getPatientById = (req, res) => {
  const patients = getPatients();
  const patient = patients.find(p => p.id === req.params.id);
  res.json(patient || {});
};

// Add a new patient
exports.addPatient = (req, res) => {
  const patients = getPatients();
  const newPatient = {
    id: `P${1000 + patients.length + 1}`,
    ...req.body,
    last_visit: new Date().toISOString().split('T')[0],
    condition: "Stable",
    aiSupportResponse: ""
  };
  patients.push(newPatient);
  savePatients(patients);
  res.redirect("/patient");
};

// Update patient with AI response
exports.updatePatientAIResponse = (id, response) => {
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === id);
  if (index !== -1) {
    patients[index].aiSupportResponse = response;
    savePatients(patients);
  }
};

// Delete a patient
exports.deletePatient = (req, res) => {
  let patients = getPatients();
  patients = patients.filter(p => p.id !== req.params.id);
  savePatients(patients);
  res.redirect("/patient");
};