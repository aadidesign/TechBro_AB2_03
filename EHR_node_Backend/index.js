const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// Routes
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const labTestRoutes = require("./routes/labTestRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const reportsRoutes = require("./routes/reportsRoutes");

// Middleware
const ejsLayouts = require("./middleware/ejsLayouts");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize empty JSON files if they don't exist
const dataFiles = [
  "patients.json", 
  "appointments.json", 
  "medicalRecords.json", 
  "prescriptions.json", 
  "labTests.json", 
  "doctors.json"
];

dataFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
});

// Set up EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(ejsLayouts);

// Home route
app.get("/", (req, res) => {
  // Get data for dashboard
  const patientsFile = path.join(__dirname, "data/patients.json");
  const appointmentsFile = path.join(__dirname, "data/appointments.json");
  const doctorsFile = path.join(__dirname, "data/doctors.json");
  
  const patients = fs.existsSync(patientsFile) ? JSON.parse(fs.readFileSync(patientsFile)) : [];
  const appointments = fs.existsSync(appointmentsFile) ? JSON.parse(fs.readFileSync(appointmentsFile)) : [];
  const doctors = fs.existsSync(doctorsFile) ? JSON.parse(fs.readFileSync(doctorsFile)) : [];
  
  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);
  
  res.render("index", {
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    totalDoctors: doctors.length,
    todayAppointments: todayAppointments
  });
});

// Use Routes
app.use("/patient", patientRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/medicalrecords", medicalRecordRoutes);
app.use("/prescription", prescriptionRoutes);
app.use("/labtests", labTestRoutes);
app.use("/doctor", doctorRoutes);
app.use("/reports", reportsRoutes);

// 404 handler
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.statusCode = 404;
  next(err);
});

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));