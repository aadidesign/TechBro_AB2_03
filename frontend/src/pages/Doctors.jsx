import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import doctorsData, { specialties, statusOptions } from '../data/doctorsData';
import AddDoctorModal from '../components/AddDoctorModal';
import ScheduleAppointmentModal from '../components/ScheduleAppointmentModal';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  
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

  // New doctor form state
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: '',
    status: 'active',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
    bio: '',
    avatar: ''
  });

  // Load doctors data
  useEffect(() => {
    setDoctors(doctorsData);
    setFilteredDoctors(doctorsData);
  }, []);

  // Filter doctors based on search term, specialty and status
  useEffect(() => {
    if (!doctors || doctors.length === 0) return;
    
    let filtered = [...doctors];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply specialty filter
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(doctor => doctor.specialty === specialtyFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doctor => doctor.status === statusFilter);
    }
    
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, specialtyFilter, statusFilter]);

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'green';
      case 'on leave':
      case 'on_leave':
        return 'yellow';
      case 'not available':
      case 'not_available':
        return 'red';
      default:
        return 'gray';
    }
  };

  // View doctor details
  const viewDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailsModalOpen(true);
  };

  // Handle edit doctor
  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setIsEditModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  // Handle doctor form change
  const handleDoctorFormChange = (e) => {
    const { name, value } = e.target;
    if (isEditModalOpen) {
      setEditingDoctor(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setNewDoctor(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Save edited doctor
  const saveEditedDoctor = () => {
    setDoctors(prev => 
      prev.map(doctor => 
        doctor.id === editingDoctor.id ? editingDoctor : doctor
      )
    );
    setIsEditModalOpen(false);
  };

  // Add new doctor
  const addNewDoctor = () => {
    const newDoctorObj = {
      id: doctors.length + 1,
      ...newDoctor,
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setDoctors(prev => [newDoctorObj, ...prev]);
    setNewDoctor({
      name: '',
      specialty: '',
      status: 'active',
      email: '',
      phone: '',
      address: '',
      education: '',
      experience: '',
      bio: '',
      avatar: ''
    });
    
    setIsAddModalOpen(false);
  };

  // Format status for display
  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Medical Doctors Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg shadow-lg"
          onClick={() => setIsAddModalOpen(true)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Doctor
        </motion.button>
      </div>
      
      {/* Search and Filters */}
      <motion.div 
        variants={itemVariants}
        className="mb-8 space-y-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
      >
        <div className="relative">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, age, or gender..."
            className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <div className="absolute right-3 top-3 text-white/50">
            Press '/' to search
          </div>
          <div className="absolute left-3 top-3.5 text-white/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setSpecialtyFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${specialtyFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
          >
            All
          </button>
          {specialties.map(specialty => (
            <button 
              key={specialty}
              onClick={() => setSpecialtyFilter(specialty)}
              className={`px-4 py-2 rounded-lg transition-all ${specialtyFilter === specialty ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              {specialty}
            </button>
          ))}
          
          <div className="ml-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
      
      {/* Doctors Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredDoctors.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="col-span-full text-center py-12"
          >
            <div className="text-white/50 text-lg">No doctors found</div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New Doctor
            </motion.button>
          </motion.div>
        ) : (
          filteredDoctors.map(doctor => (
            <motion.div
              key={doctor.id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden cursor-pointer"
              onClick={() => viewDoctorDetails(doctor)}
            >
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {doctor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{doctor.name}</h3>
                      <p className="text-white/70 text-sm">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs bg-${getStatusColor(doctor.status)}-500/20 text-${getStatusColor(doctor.status)}-400`}>
                    {formatStatus(doctor.status)}
                  </div>
                </div>
                
                <div className="space-y-1 text-white/80">
                  <div className="flex items-center text-white/70">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{doctor.email}</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm">{doctor.phone}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Experience: {doctor.experience} years</span>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewDoctorDetails(doctor);
                    }}
                  >
                    View Profile
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
      
      {/* Doctor Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedDoctor && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsDetailsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-[#0c1524] border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-400">Doctor Profile</h2>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsDetailsModalOpen(false)}
                      className="text-white/50 hover:text-white"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white text-lg font-medium">{selectedDoctor.name}</h3>
                      <div className={`px-3 py-1 rounded-full bg-${getStatusColor(selectedDoctor.status)}-500/20 text-${getStatusColor(selectedDoctor.status)}-400 capitalize`}>
                        {formatStatus(selectedDoctor.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-6 bg-white/5 p-3 rounded-lg border border-white/10">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                        {selectedDoctor.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">Specialty: {selectedDoctor.specialty}</p>
                        <p className="text-white/70 text-sm">Experience: {selectedDoctor.experience} years</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white/80 mb-2 font-medium">Contact Information</h4>
                        <div className="bg-white/5 rounded-lg px-4 py-3 text-white/90 border border-white/10 space-y-2">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{selectedDoctor.email}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{selectedDoctor.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white/80 mb-2 font-medium">Qualification</h4>
                        <div className="bg-white/5 rounded-lg px-4 py-3 text-white/90 border border-white/10">
                          <p>{selectedDoctor.qualification}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white/80 mb-2 font-medium">Biography</h4>
                      <div className="bg-white/5 rounded-lg px-4 py-3 text-white/90 border border-white/10">
                        <p>{selectedDoctor.bio}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white/80 mb-2 font-medium">Availability</h4>
                      <div className="bg-white/5 rounded-lg px-4 py-3 text-white/90 border border-white/10 grid grid-cols-2 gap-2">
                        {selectedDoctor.availability && Object.entries(selectedDoctor.availability).map(([day, times]) => (
                          <div key={day} className="text-sm">
                            <span className="font-medium capitalize">{day}: </span>
                            {times.length > 0 ? times.join(', ') : 'Not Available'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-8">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white/10 text-white/80 rounded-lg transition-all"
                      onClick={() => {
                        setIsScheduleModalOpen(true);
                        setIsDetailsModalOpen(false);
                      }}
                    >
                      Schedule Appointment
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white/10 text-white/80 rounded-lg transition-all"
                      onClick={() => handleEditDoctor(selectedDoctor)}
                    >
                      Edit Profile
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg shadow-lg transition-all"
                      onClick={() => setIsDetailsModalOpen(false)}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <AddDoctorModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          newDoctor={newDoctor}
          handleDoctorFormChange={handleDoctorFormChange}
          addNewDoctor={addNewDoctor}
          specialties={specialties}
        />
      )}
      
      {/* Edit Doctor Modal */}
      {isEditModalOpen && editingDoctor && (
        <AddDoctorModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          newDoctor={editingDoctor}
          handleDoctorFormChange={handleDoctorFormChange}
          addNewDoctor={saveEditedDoctor}
          specialties={specialties}
          isEditing={true}
        />
      )}
      
      {/* Schedule Appointment Modal */}
      {isScheduleModalOpen && selectedDoctor && (
        <ScheduleAppointmentModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          doctor={selectedDoctor}
        />
      )}
    </motion.div>
  );
};

export default Doctors; 