const fs = require("fs");
const path = require("path");

const labTestsFile = path.join(__dirname, "../data/labTests.json");

const getLabTests = () => {
  if (!fs.existsSync(labTestsFile)) return [];
  return JSON.parse(fs.readFileSync(labTestsFile));
};

const saveLabTests = (data) => {
  fs.writeFileSync(labTestsFile, JSON.stringify(data, null, 2));
};

// Get all lab tests
exports.getAllLabTests = (req, res) => {
  const labTests = getLabTests();
  res.render("labTests", { labTests });
};

// Add a new lab test
exports.addLabTest = (req, res) => {
  const labTests = getLabTests();
  const { patientName, testName, result } = req.body;
  const newLabTest = { id: Date.now(), patientName, testName, result };
  labTests.push(newLabTest);
  saveLabTests(labTests);
  res.redirect("/labtests");
};
