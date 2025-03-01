const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.get("/", appointmentController.getAllAppointments);
router.post("/book", appointmentController.bookAppointment);
router.get("/cancel/:id", appointmentController.cancelAppointment);

module.exports = router;
