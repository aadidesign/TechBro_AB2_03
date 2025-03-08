import { useState, useEffect } from 'react';
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

  return (
    <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 h-full overflow-auto">
      {/* Header with AI Summary and Action Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Medical Records Management</h1>
          <div className="bg-black/30 backdrop-blur-md p-3 rounded-xl text-white text-sm max-w-2xl flex items-start space-x-2 animate-pulse border border-white/10">
            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <span className="font-semibold text-blue-400">AI Insight:</span>
              <span className="text-white/80"> Analyzing patient records for trends and risk factors...</span>
            </div>
          </div>
        </div>

        <button 
          type="button" 
          className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white hover:from-blue-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:scale-105 active:scale-95"
          onClick={() => setShowAddModal(true)}
        >
          <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Patient
        </button>
      </div>

      {/* Smart Search Bar */}
      <div className="mb-8">
        <div className="relative bg-black/30 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-white/10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-4 bg-transparent border-0 focus:ring-2 focus:ring-cyan-300 text-white placeholder-gray-400 focus:outline-none" 
            placeholder="Search by patient name, age, or gender..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={() => setCurrentFilter('all')} 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-black/30 text-white hover:bg-white/10'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setCurrentFilter('male')} 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === 'male' 
              ? 'bg-blue-600 text-white' 
              : 'bg-black/30 text-white hover:bg-white/10'
          }`}
        >
          Male
        </button>
        <button 
          onClick={() => setCurrentFilter('female')} 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === 'female' 
              ? 'bg-blue-600 text-white' 
              : 'bg-black/30 text-white hover:bg-white/10'
          }`}
        >
          Female
        </button>
        <button 
          onClick={() => setCurrentSort(currentSort === 'age' ? 'none' : 'age')} 
          className={`ml-auto px-4 py-2 text-sm font-medium flex items-center ${
            currentSort === 'age' 
              ? 'text-blue-400' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Sort by Age
        </button>
      </div>

      {/* Patient Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredPatients.length === 0 ? (
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center flex items-center justify-center h-48 col-span-full border border-white/10">
            <div className="text-white/70">
              <svg className="w-12 h-12 mx-auto mb-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01" />
              </svg>
              <p>No patients found</p>
              <p className="text-sm mt-1">Try changing your search or filters</p>
            </div>
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
      </div>

      {/* Dynamic Health Charts */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Demographics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Age Distribution</h3>
            <AgeChart patients={patients} />
          </div>
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Gender Ratio</h3>
            <GenderChart patients={patients} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddPatientModal 
          onClose={() => setShowAddModal(false)} 
          onSave={addPatient} 
        />
      )}
      
      {showDeleteModal && (
        <DeleteConfirmationModal 
          onClose={() => setShowDeleteModal(false)} 
          onConfirm={() => deletePatient(patientToDelete)} 
        />
      )}

      {/* Notification */}
      {notification.show && (
        <Notification message={notification.message} />
      )}
    </div>
  );
};

export default Patients; 