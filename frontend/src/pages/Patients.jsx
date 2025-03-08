import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('none');
  const [searchTerm, setSearchTerm] = useState('');
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen p-6 space-y-8"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold text-white pb-4">
            Medical Records Management
          </h1>
          <div className="flex items-start gap-4 bg-gradient-to-r from-blue-900/40 to-blue-800/30 
                        backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 shadow-lg">
            <div className="p-3.5 rounded-lg bg-blue-500/20 ring-1 ring-blue-500/40">
              <svg 
                className="w-5 h-5 text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2.5" 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </div>
            <div className="space-y-2">
              <span className="font-semibold text-blue-300">AI Insight:</span>
              <p className="text-blue-100/90">
                Analyzing patient records for trends and risk factors...
              </p>
            </div>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="group px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/80 to-cyan-600/80 
                     text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 
                     transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Patient
        </motion.button>
      </div>

      {/* Search and Filters Section */}
      <div className="relative space-y-6">
        {/* Search Input with Enhanced Icon */}
        <div className="relative group">
          {/* Gradient background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl 
                          group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
          </div>
          
          {/* Search Icon with improved visibility */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-white/70 group-hover:text-blue-400 transition-colors duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>

          {/* Search Input */}
          <input 
            type="text"
            placeholder="Search by patient name, age, or gender..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-800/40 backdrop-blur-xl rounded-xl 
                     border border-white/20 text-white placeholder-white/50
                     focus:bg-slate-800/60 focus:border-blue-400/50 focus:ring-2 
                     focus:ring-blue-400/20 transition-all duration-200
                     group-hover:border-white/30"
          />

          {/* Keyboard Shortcut Hint */}
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <span className="text-slate-400 text-sm">Press '/' to search</span>
          </div>
        </div>

        {/* Filter Buttons with better contrast */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {['all', 'male', 'female'].map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentFilter === filter
                  ? filter === 'male' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : filter === 'female'
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-slate-800/40 text-slate-300 border border-slate-600/50 hover:bg-slate-800/60'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </motion.button>
          ))}
          
          {/* Sort Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentSort(currentSort === 'age' ? 'none' : 'age')}
            className={`ml-auto px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 
                       ${currentSort === 'age'
                         ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                         : 'bg-slate-800/40 text-slate-300 border border-slate-600/50 hover:bg-slate-800/60'
                       }`}
          >
            <span>Sort by Age</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M3 4h13M3 8h9M3 12h5m0 0v6m0-6h14" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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