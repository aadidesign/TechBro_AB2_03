const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// Get all appointments
router.get("/", appointmentController.getAllAppointments);

// Get upcoming appointments
router.get("/upcoming", appointmentController.getUpcomingAppointments);

// Get appointments by date range
router.get("/range", appointmentController.getAppointmentsByDateRange);

// Get appointment by ID
router.get("/:id", appointmentController.getAppointmentById);

// Create new appointment
router.post("/", appointmentController.createAppointment);

// Update appointment
router.put("/:id", appointmentController.updateAppointment);

// Cancel appointment
router.patch("/:id/cancel", appointmentController.cancelAppointment);

// Delete appointment
router.delete("/:id", appointmentController.deleteAppointment);

// Get available time slots for a specific date and doctor
router.get("/available-slots/:date/:doctorId", appointmentController.getAvailableTimeSlots);

module.exports = router;
