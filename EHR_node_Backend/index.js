const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const labTestRoutes = require("./routes/labTestRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const reportsRoutes = require("./routes/reportsRoutes");



const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", (req, res) => {
  res.render("index");
}
);

// Use Patient Routes
app.use("/patient", patientRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/medicalrecords", medicalRecordRoutes);
app.use("/prescription", prescriptionRoutes);
app.use("/labtests", labTestRoutes);
app.use("/doctor", doctorRoutes);
app.use("/reports", reportsRoutes);


app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));