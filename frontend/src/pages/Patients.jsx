import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PatientCard from '../components/PatientCard';
import AddPatientModal from '../components/AddPatientModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import AgeChart from '../components/AgeChart';
import GenderChart from '../components/GenderChart';
import Notification from '../components/Notification';
import patientsData from '../data/patientsData';
import EmptyState from '../components/EmptyState';

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
  const [notification, setNotification] = useState({
    show: false,
    message: ''
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Load patients data
  useEffect(() => {
    setPatients(patientsData);
    setFilteredPatients(patientsData);
  }, []);

  // Filter and sort patients
  useEffect(() => {
    if (!patients.length) return;

    let filtered = [...patients];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.includes(searchTerm)
      );
    }
    
    // Apply gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(patient => patient.gender.toLowerCase() === genderFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status.toLowerCase() === statusFilter);
    }
    
    // Apply sorting
    if (currentSort === 'age') {
      filtered.sort((a, b) => a.age - b.age);
    } else if (currentSort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredPatients(filtered);
  }, [patients, searchTerm, genderFilter, statusFilter, currentSort]);

  // Handle adding a new patient
  const handleAddPatient = (newPatient) => {
    const patientWithId = {
      ...newPatient,
      id: patients.length + 1,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setPatients([...patients, patientWithId]);
    setShowAddModal(false);
    showNotification('Patient added successfully');
  };

  // Delete patient
  const deletePatient = (id) => {
    const updatedPatients = patients.filter(patient => patient.id !== id);
    setPatients(updatedPatients);
    setShowDeleteModal(false);
    showNotification('Patient deleted successfully');
  };

  // Show notification
  const showNotification = (message) => {
    setNotification({
      show: true,
      message
    });
    
    setTimeout(() => {
      setNotification({
        show: false,
        message: ''
      });
    }, 3000);
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
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredPatients.length === 0 ? (
          <div className="col-span-full">
            <EmptyState 
              message="No patients match your search criteria. Try adjusting your filters or add a new patient."
              icon="user"
            />
          </div>
        ) : (
          filteredPatients.map(patient => (
            <motion.div
              key={patient.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.2)"
              }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10"
            >
              <PatientCard 
                patient={patient} 
                onDelete={(patient) => {
                  setPatientToDelete(patient);
                  setShowDeleteModal(true);
                }}
              />
            </motion.div>
          ))
        )}
      </motion.div>
      
      {/* Add Patient Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddPatientModal
            show={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddPatient}
          />
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && patientToDelete && (
          <DeleteConfirmationModal
            show={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => deletePatient(patientToDelete.id)}
            title="Delete Patient"
            message={`Are you sure you want to delete ${patientToDelete.name}'s record? This action cannot be undone.`}
          />
        )}
      </AnimatePresence>
      <Notification
        show={notification.show}
        message={notification.message}
      />
    </motion.div>
  );
};

export default Patients; 