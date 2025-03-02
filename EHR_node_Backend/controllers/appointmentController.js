const fs = require("fs");
const path = require("path");

const appointmentsFile = path.join(__dirname, "../data/appointments.json");

const getAppointments = () => {
  if (!fs.existsSync(appointmentsFile)) return [];
  return JSON.parse(fs.readFileSync(appointmentsFile));
};

const saveAppointments = (data) => {
  fs.writeFileSync(appointmentsFile, JSON.stringify(data, null, 2));
};

// Get all appointments
exports.getAllAppointments = (req, res) => {
  const appointments = getAppointments();
  res.render("appointments", { appointments });
};

// Schedule a new appointment
exports.bookAppointment = (req, res) => {
  const appointments = getAppointments();
  const { patientName, doctor, date, time } = req.body;
  const newAppointment = { id: Date.now(), patientName, doctor, date, time };
  appointments.push(newAppointment);
  saveAppointments(appointments);
  res.redirect("/appointment");
};

// Cancel an appointment
exports.cancelAppointment = (req, res) => {
  let appointments = getAppointments();
  appointments = appointments.filter((a) => a.id !== parseInt(req.params.id));
  saveAppointments(appointments);
  res.redirect("/appointment");
};