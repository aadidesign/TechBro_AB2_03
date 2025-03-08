const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const patientsFile = path.join(__dirname, "../data/patients.json");

// Helper function to read patients data
const getPatients = () => {
  try {
    if (!fs.existsSync(patientsFile)) {
      fs.writeFileSync(patientsFile, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(patientsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading patients file:', error);
    return [];
  }
};

// Helper function to save patients data
const savePatients = (patients) => {
  try {
    fs.writeFileSync(patientsFile, JSON.stringify(patients, null, 2));
  } catch (error) {
    console.error('Error saving patients file:', error);
    throw new Error('Failed to save patient data');
  }
};

// Get all patients with optional filtering and sorting
exports.getAllPatients = async (req, res) => {
  try {
    const { search, filter, sort } = req.query;
    let patients = getPatients();

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      patients = patients.filter(patient => 
        patient.name?.toLowerCase().includes(searchLower) ||
        patient.age?.toString().includes(searchLower) ||
        patient.gender?.toLowerCase().includes(searchLower)
      );
    }

    // Apply gender filter if provided
    if (filter && filter !== 'all') {
      patients = patients.filter(patient => 
        patient.gender?.toLowerCase() === filter.toLowerCase()
      );
    }

    // Apply sorting if provided
    if (sort === 'age') {
      patients.sort((a, b) => (a.age || 0) - (b.age || 0));
    }

    // Calculate statistics
    const stats = {
      total: patients.length,
      gender: {
        male: patients.filter(p => p.gender?.toLowerCase() === 'male').length,
        female: patients.filter(p => p.gender?.toLowerCase() === 'female').length
      },
      ageGroups: {
        '0-18': patients.filter(p => p.age <= 18).length,
        '19-35': patients.filter(p => p.age > 18 && p.age <= 35).length,
        '36-50': patients.filter(p => p.age > 35 && p.age <= 50).length,
        '51+': patients.filter(p => p.age > 50).length
      }
    };

    res.json({
      patients,
      stats
    });
  } catch (error) {
    console.error('Error getting patients:', error);
    res.status(500).json({ error: 'Failed to get patients' });
  }
};

// Get a single patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patients = getPatients();
    const patient = patients.find(p => p.id === req.params.id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    console.error('Error getting patient:', error);
    res.status(500).json({ error: 'Failed to get patient' });
  }
};

// Add a new patient
exports.addPatient = async (req, res) => {
  try {
    const patients = getPatients();
    const { name, age, gender, contact, address, medicalHistory } = req.body;

    // Validate required fields
    if (!name || !age || !gender) {
      return res.status(400).json({ error: 'Name, age, and gender are required' });
    }

    // Generate a unique ID
    const timestamp = new Date().getTime();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const uniqueId = `P${timestamp}${randomSuffix}`;

    const newPatient = {
      id: uniqueId,
      name,
      age: parseInt(age),
      gender: gender.toLowerCase(),
      contact: contact || '',
      address: address || '',
      medicalHistory: medicalHistory || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    patients.push(newPatient);
    savePatients(patients);

    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).json({ error: 'Failed to add patient' });
  }
};

// Update a patient
exports.updatePatient = async (req, res) => {
  try {
    const patients = getPatients();
    const patientIndex = patients.findIndex(p => p.id === req.params.id);

    if (patientIndex === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const updatedPatient = {
      ...patients[patientIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    patients[patientIndex] = updatedPatient;
    savePatients(patients);

    res.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
};

// Delete a patient
exports.deletePatient = async (req, res) => {
  try {
    let patients = getPatients();
    const patientIndex = patients.findIndex(p => p.id === req.params.id);

    if (patientIndex === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    patients = patients.filter(p => p.id !== req.params.id);
    savePatients(patients);

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
};

// Get patient statistics
exports.getPatientStats = async (req, res) => {
  try {
    const patients = getPatients();

    const stats = {
      total: patients.length,
      gender: {
        male: patients.filter(p => p.gender.toLowerCase() === 'male').length,
        female: patients.filter(p => p.gender.toLowerCase() === 'female').length
      },
      ageGroups: {
        '0-18': patients.filter(p => p.age <= 18).length,
        '19-35': patients.filter(p => p.age > 18 && p.age <= 35).length,
        '36-50': patients.filter(p => p.age > 35 && p.age <= 50).length,
        '51+': patients.filter(p => p.age > 50).length
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting patient statistics:', error);
    res.status(500).json({ error: 'Failed to get patient statistics' });
  }
};