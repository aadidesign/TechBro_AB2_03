const fs = require("fs");
const path = require("path");

const prescriptionsFile = path.join(__dirname, "../data/prescriptions.json");

const getPrescriptions = () => {
  if (!fs.existsSync(prescriptionsFile)) return [];
  return JSON.parse(fs.readFileSync(prescriptionsFile));
};

const savePrescriptions = (data) => {
  fs.writeFileSync(prescriptionsFile, JSON.stringify(data, null, 2));
};

// Get all prescriptions
exports.getAllPrescriptions = (req, res) => {
  const prescriptions = getPrescriptions();
  res.render("prescriptions", { prescriptions });
};

// Add a new prescription
exports.addPrescription = (req, res) => {
  const prescriptions = getPrescriptions();
  const { patientName, doctor, medicine, dosage } = req.body;
  const newPrescription = { id: Date.now(), patientName, doctor, medicine, dosage };
  prescriptions.push(newPrescription);
  savePrescriptions(prescriptions);
  res.redirect("/prescription");
};