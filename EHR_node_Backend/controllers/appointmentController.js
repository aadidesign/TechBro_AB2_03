const fs = require("fs");
const path = require("path");
const Appointment = require('../models/appointment');
const { startOfDay, endOfDay, parseISO, addDays } = require('date-fns');

const appointmentsFile = path.join(__dirname, "../data/appointments.json");

const getAppointments = () => {
  if (!fs.existsSync(appointmentsFile)) return [];
  return JSON.parse(fs.readFileSync(appointmentsFile));
};

const saveAppointments = (data) => {
  fs.writeFileSync(appointmentsFile, JSON.stringify(data, null, 2));
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, doctor, date, search } = req.query;
    let query = {};

    // Apply filters if provided
    if (status) query.status = status;
    if (doctor) query.doctor = doctor;
    if (date) {
      const startDate = startOfDay(parseISO(date));
      const endDate = endOfDay(parseISO(date));
      query.date = { $gte: startDate, $lte: endDate };
    }
    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { doctor: { $regex: search, $options: 'i' } }
      ];
    }

    const appointments = await Appointment.find(query)
      .sort({ date: 1, time: 1 })
      .exec();

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
};

// Get upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const today = new Date();
    const appointments = await Appointment.find({
      date: { $gte: today },
      status: { $in: ['confirmed', 'pending'] }
    })
      .sort({ date: 1, time: 1 })
      .limit(10)
      .exec();

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching upcoming appointments' });
  }
};

// Get appointments by date range
exports.getAppointmentsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const appointments = await Appointment.find({
      date: {
        $gte: startOfDay(parseISO(startDate)),
        $lte: endOfDay(parseISO(endDate))
      }
    }).sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments by date range' });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointment' });
  }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    console.log('Received appointment data:', req.body); // Add logging

    const appointmentData = {
      ...req.body,
      status: req.body.status || 'pending'
    };

    // Validate required fields
    const requiredFields = ['patientName', 'doctor', 'date', 'time', 'type'];
    const missingFields = requiredFields.filter(field => !appointmentData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Check for time slot availability
    const existingAppointment = await Appointment.findOne({
      date: appointmentData.date,
      time: appointmentData.time,
      doctor: appointmentData.doctor,
      status: { $nin: ['canceled', 'completed'] }
    });

    if (existingAppointment) {
      return res.status(409).json({ 
        error: 'This time slot is already booked' 
      });
    }

    const appointment = new Appointment(appointmentData);
    await appointment.save();
    
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error); // Add logging
    res.status(500).json({ 
      error: 'Error creating appointment',
      details: error.message 
    });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check for time slot availability if date/time is being updated
    if (req.body.date || req.body.time) {
      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id },
        date: req.body.date || appointment.date,
        time: req.body.time || appointment.time,
        doctor: req.body.doctor || appointment.doctor,
        status: { $ne: 'canceled' }
      });

      if (conflictingAppointment) {
        return res.status(400).json({ error: 'Time slot is not available' });
      }
    }

    Object.assign(appointment, req.body);
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating appointment' });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.status = 'canceled';
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error canceling appointment' });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting appointment' });
  }
};

// Get available time slots
exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, doctorId } = req.params;
    
    console.log('Checking slots for:', { date, doctorId }); // Add logging

    // Define all possible time slots
    const allTimeSlots = [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
      "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    ];

    // Get booked appointments for the date and doctor
    const bookedAppointments = await Appointment.find({
      date: date,
      doctor: doctorId,
      status: { $nin: ['canceled', 'completed'] }
    }).select('time duration');

    console.log('Booked appointments:', bookedAppointments); // Add logging

    // Filter out booked slots
    const availableSlots = allTimeSlots.filter(slot => {
      return !bookedAppointments.some(appointment => appointment.time === slot);
    });

    res.json(availableSlots);
  } catch (error) {
    console.error('Error getting available slots:', error); // Add logging
    res.status(500).json({ 
      error: 'Error fetching available time slots',
      details: error.message 
    });
  }
};