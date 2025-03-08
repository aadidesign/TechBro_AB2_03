import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PatientCard from '../components/PatientCard';
import AddPatientModal from '../components/AddPatientModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import AgeChart from '../components/AgeChart';
import GenderChart from '../components/GenderChart';
import Notification from '../components/Notification';
import axios from 'axios';

// Add animation variants
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

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
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    gender: {
      male: 0,
      female: 0
    },
    ageGroups: {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51+': 0
    }
  });

  // Fetch patients data
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/patients', {
        params: {
          search: searchTerm,
          filter: currentFilter,
          sort: currentSort
        }
      });
      
      if (response.data && response.data.patients) {
        setPatients(response.data.patients);
        setFilteredPatients(response.data.patients);
        setStats(response.data.stats);
      } else {
        throw new Error('Invalid data format received from server');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.response?.data?.error || 'Failed to load patients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load patients on component mount and when filters change
  useEffect(() => {
    fetchPatients();
  }, [searchTerm, currentFilter, currentSort]);

  // Add a new patient
  const addPatient = async (patientData) => {
    try {
      const response = await axios.post('http://localhost:3000/api/patients', patientData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        await fetchPatients(); // Refresh the list
        setShowAddModal(false);
        showNotification('Patient added successfully', 'success');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      showNotification(error.response?.data?.error || 'Failed to add patient', 'error');
    }
  };

  // Delete a patient
  const deletePatient = async (patientId) => {
    try {
      await axios.delete(`http://localhost:3000/api/patients/${patientId}`);
      await fetchPatients(); // Refresh the list
      setShowDeleteModal(false);
      showNotification('Patient deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting patient:', error);
      showNotification(error.response?.data?.error || 'Failed to delete patient', 'error');
    }
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Open delete confirmation modal
  const openDeleteModal = (patientId) => {
    setPatientToDelete(patientId);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
        <button
          onClick={fetchPatients}
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

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
            Patients
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <motion.div
              key={`patient-${patient.id}-${patient.name}`}
              variants={cardVariants}
              className="relative"
            >
              <PatientCard
                patient={patient}
                onDelete={() => openDeleteModal(patient.id)}
              />
            </motion.div>
          ))
        ) : (
          <EmptyState />
        )}
      </motion.div>

      {/* Modals */}
      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onSubmit={addPatient}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => deletePatient(patientToDelete)}
        />
      )}

      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
        />
      )}

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <AgeChart data={stats.ageGroups} />
        <GenderChart data={stats.gender} />
      </div>
    </motion.div>
  );
};

// Empty state component
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
    <div className="w-16 h-16 mb-4 text-slate-400">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-medium text-slate-300">No patients found</h3>
    <p className="mt-2 text-slate-400">Try adjusting your search or filters</p>
  </div>
);

export default Patients; 