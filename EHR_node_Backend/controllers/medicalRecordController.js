const fs = require("fs");
const path = require("path");

const recordsFile = path.join(__dirname, "../data/medicalRecords.json");

const getRecords = () => {
  if (!fs.existsSync(recordsFile)) return [];
  return JSON.parse(fs.readFileSync(recordsFile));
};

const saveRecords = (data) => {
  fs.writeFileSync(recordsFile, JSON.stringify(data, null, 2));
};

// Get all medical records
exports.getAllRecords = (req, res) => {
  const records = getRecords();
  res.render("medicalRecords", { records });
};

// Add a new medical record
exports.addRecord = (req, res) => {
  const records = getRecords();
  const { patientName, diagnosis, prescription, doctor } = req.body;
  const newRecord = { id: Date.now(), patientName, diagnosis, prescription, doctor };
  records.push(newRecord);
  saveRecords(records);
  res.redirect("/medicalrecords");
};
