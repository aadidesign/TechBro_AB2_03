const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const cors = require('cors');
const fs = require('fs');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize empty JSON files if they don't exist
const files = ['patients', 'appointments', 'doctors', 'medicalRecords'];
files.forEach(file => {
  const filePath = path.join(dataDir, `${file}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
});

// Routes
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const labTestRoutes = require("./routes/labTestRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Models
const Patient = require("./models/patient.model");
const Appointment = require("./models/appointment");
const MedicalStaff = require("./models/medicalStaff.model");

// Middleware
const ejsLayouts = require("./middleware/ejsLayouts");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin:admin@socialapp.76klw.mongodb.net/medical-clinic";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);  // Exit if cannot connect to database
});

// Set up EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(ejsLayouts);

// Add after app initialization and before routes
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(flash());

// // Add middleware to make flash messages available to all views
// app.use((req, res, next) => {
//   res.locals.messages = {
//     success: req.flash('success'),
//     error: req.flash('error')
//   };
//   next();
// });

// Add this before your routes
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add these middleware configurations before your routes
app.use(express.json());
app.use(bodyParser.json());

// Home route
app.get("/", async (req, res, next) => {
  try {
    const [totalPatients, totalAppointments, totalDoctors, todayAppointments] = await Promise.all([
      Patient.countDocuments(),
      Appointment.countDocuments(),
      MedicalStaff.countDocuments({ role: "Doctor" }),
      Appointment.find({
        date: new Date().toISOString().split("T")[0]
      })
      .populate("patient_id", "name")
      .populate("doctor_id", "name")
    ]);

    res.render("index", {
      totalPatients,
      totalAppointments,
      totalDoctors,
      todayAppointments
    });
  } catch (err) {
    next(err);
  }
});

// Use Routes
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/lab-tests", labTestRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/AI", (req, res) => {
  res.render("AI");
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.statusCode = 404;
  next(err);
});

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = app;