const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    recordId: {
        type: String,
        required: true,
        unique: true
    },
    patientId: {
        type: String,
        ref: 'Patient',
        required: true
    },
    visitType: {
        type: String,
        required: true,
        enum: ['Regular Checkup', 'Emergency', 'Follow-up', 'Specialist Consultation']
    },
    visitDate: {
        type: Date,
        required: true
    },
    doctorId: {
        type: String,
        ref: 'MedicalStaff',
        required: true
    },
    chiefComplaint: {
        type: String,
        required: true
    },
    diagnosis: [{
        condition: String,
        notes: String,
        date: Date
    }],
    vitals: {
        bloodPressure: String,
        heartRate: Number,
        temperature: Number,
        respiratoryRate: Number,
        oxygenSaturation: Number,
        weight: Number,
        height: Number
    },
    prescriptions: [{
        medication: String,
        dosage: String,
        frequency: String,
        duration: String,
        notes: String
    }],
    labTests: [{
        testName: String,
        status: {
            type: String,
            enum: ['Ordered', 'Completed', 'Cancelled']
        },
        results: String,
        orderedDate: Date,
        completedDate: Date
    }],
    treatmentPlan: {
        type: String
    },
    followUpDate: Date,
    attachments: [{
        type: String  // URLs or file paths
    }],
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema); 