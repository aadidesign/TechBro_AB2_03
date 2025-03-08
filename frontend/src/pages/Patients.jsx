import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PatientCard from '../components/PatientCard';
import AddPatientModal from '../components/AddPatientModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import AgeChart from '../components/AgeChart';
import GenderChart from '../components/GenderChart';
import Notification from '../components/Notification';
import patientsData from '../data/patientsData';

const Patients = () => {
  // State variables
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('none');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Load mock data on component mount
  useEffect(() => {
    // In a real app, this would be a fetch call to an API
    setPatients(patientsData);
  }, []);

  // Filter and sort patients whenever dependencies change
  useEffect(() => {
    filterAndSortPatients();
  }, [patients, currentFilter, currentSort, searchTerm]);

  // Filter and sort patients based on current criteria
  const filterAndSortPatients = () => {
    let result = [...patients];
    
    // Apply gender filter
    if (currentFilter !== 'all') {
      result = result.filter(p => p.gender === currentFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.age.toString().includes(searchTerm) ||
        p.gender.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (currentSort === 'age') {
      result = result.sort((a, b) => a.age - b.age);
    }
    
    setFilteredPatients(result);
  };

  // Add a new patient
  const addPatient = (patientData) => {
    const newPatient = {
      ...patientData,
      id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1
    };
    
    setPatients([...patients, newPatient]);
    setShowAddModal(false);
    showNotification('Patient added successfully');
  };

  // Delete a patient
  const deletePatient = (patientId) => {
    setPatients(patients.filter(p => p.id !== patientId));
    setShowDeleteModal(false);
    showNotification('Patient deleted successfully');
  };

  // Show notification
  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  // Open delete confirmation modal
  const openDeleteModal = (patientId) => {
    setPatientToDelete(patientId);
    setShowDeleteModal(true);
  };

  // Handle form submission in AddPatientModal
  const handleSubmit = (event) => {
    event.preventDefault();
    // Implementation of form submission logic
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Patients</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Patient
        </motion.button>
      </div>
      
      {/* Search and Filters */}
      <motion.div 
        variants={itemVariants}
        className="mb-8 space-y-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search patients by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-xs text-white/40">Press / to search</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-white/70">Filter by:</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              genderFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => setGenderFilter('all')}
          >
            All Genders
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              genderFilter === 'male' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => setGenderFilter('male')}
          >
            Male
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              genderFilter === 'female' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => setGenderFilter('female')}
          >
            Female
          </motion.button>
          
          <div className="ml-auto flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentSort(currentSort === 'age' ? 'none' : 'age')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentSort === 'age'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Sort by Age
            </motion.button>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      {/* Patient Cards Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {filteredPatients.length === 0 ? (
          <div className="col-span-full">
            <EmptyState />
          </div>
        ) : (
          filteredPatients.map(patient => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              onDelete={openDeleteModal}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.05]"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Age Distribution</h3>
          <AgeChart patients={patients} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.05]"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Gender Distribution</h3>
          <GenderChart patients={patients} />
        </motion.div>
      </div>

      {/* Modals */}
      <AddPatientModal 
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={addPatient}
      />
      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deletePatient(patientToDelete)}
        title="Delete Patient"
        message="Are you sure you want to delete this patient? This action cannot be undone."
      />
      <Notification
        show={notification.show}
        message={notification.message}
      />
    </motion.div>
  );
};

const EmptyState = () => (
  <div className="text-center p-8 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.05]">
    <svg className="w-16 h-16 mx-auto text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01" />
    </svg>
    <p className="mt-4 text-white/70">No patients found</p>
    <p className="text-sm text-white/50">Try adjusting your search or filters</p>
  </div>
);

export default Patients; 