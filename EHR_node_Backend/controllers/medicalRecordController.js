const fs = require("fs");
const path = require("path");

const recordsFile = path.join(__dirname, "../data/medicalRecords.json");



const saveRecords = (data) => {
  fs.writeFileSync(recordsFile, JSON.stringify(data, null, 2));
};

// Get all medical records
exports.getAllRecords = (req, res) => {
  const records = getRecords();
  res.render("medicalrecords", { records });
};

// Add a new medical record
exports.addRecord = (req, res) => {
  try {
    const records = getRecords();
    const { patientName, doctor, date, diagnosis, severity } = req.body;
    
    const newRecord = {
      id: Date.now(),
      patient_name: patientName,
      doctor,
      date,
      diagnosis,
      severity,
      created_at: new Date().toISOString()
    };

    records.push(newRecord);
    saveRecords(records);
    
    req.flash('success', 'Medical record added successfully');
    res.redirect("/medicalrecords");
  } catch (error) {
    console.error('Error adding medical record:', error);
    req.flash('error', 'Failed to add medical record');
    res.redirect("/medicalrecords");
  }
};

// Helper functions
function getRecords() {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../data/medicalRecords.json'));
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading records:', error);
    return [];
  }
}


