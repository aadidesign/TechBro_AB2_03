const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const ehrRoutes = require('./routes/ehrRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const aiRecommendationRoutes = require('./routes/aiRecommendationRoutes');

// Configure environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:admin@socialapp.76klw.mongodb.net/socialapp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/ehr', ehrRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/ai-recommendations', aiRecommendationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; 