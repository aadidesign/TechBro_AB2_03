const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 30
  },
  type: {
    type: String,
    required: true,
    enum: ['consultation', 'followup', 'checkup', 'labresults', 'vaccination', 'surgery', 'emergency', 'therapy']
  },
  status: {
    type: String,
    required: true,
    enum: ['confirmed', 'pending', 'canceled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  room: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema); 