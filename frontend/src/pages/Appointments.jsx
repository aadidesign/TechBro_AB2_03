import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import appointmentsData, { statusOptions, appointmentTypes, doctors } from '../data/appointmentsData';
import ScheduleAppointmentModal from '../components/ScheduleAppointmentModal';

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

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);

  // Load appointments data
  useEffect(() => {
    setAppointments(appointmentsData);
  }, []);

  // Filter and group appointments by date
  useEffect(() => {
    if (!appointments.length) return;

    let filtered = [...appointments];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(appointment => 
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.date === dateFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }
    
    // Group by date
    const grouped = filtered.reduce((acc, appointment) => {
      if (!acc[appointment.date]) {
        acc[appointment.date] = [];
      }
      acc[appointment.date].push(appointment);
      return acc;
    }, {});
    
    // Sort dates
    const sortedGrouped = Object.keys(grouped)
      .sort((a, b) => new Date(a) - new Date(b))
      .reduce((acc, date) => {
        acc[date] = grouped[date];
        return acc;
      }, {});
    
    setFilteredAppointments(sortedGrouped);
  }, [appointments, searchTerm, dateFilter, statusFilter]);

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'canceled':
        return 'red';
      case 'completed':
        return 'blue';
      default:
        return 'gray';
    }
  };

  // Handle schedule new appointment
  const handleScheduleAppointment = (appointmentData) => {
    const newAppointment = {
      id: appointments.length + 1,
      ...appointmentData,
      status: 'confirmed'
    };
    
    setAppointments([...appointments, newAppointment]);
    setIsScheduleModalOpen(false);
  };

  // Handle cancel appointment
  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;
    
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === selectedAppointment.id 
        ? { ...appointment, status: 'canceled' } 
        : appointment
    );
    
    setAppointments(updatedAppointments);
    setSelectedAppointment({ ...selectedAppointment, status: 'canceled' });
  };

  // Handle edit appointment
  const handleEditClick = () => {
    setAppointmentToEdit(selectedAppointment);
    setIsEditModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  // Handle update appointment
  const handleUpdateAppointment = (updatedData) => {
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === updatedData.id 
        ? { ...updatedData } 
        : appointment
    );
    
    setAppointments(updatedAppointments);
    setIsEditModalOpen(false);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Appointments Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg shadow-lg"
          onClick={() => setIsScheduleModalOpen(true)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Schedule Appointment
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
            placeholder="Search appointments..."
            className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <div className="absolute left-3 top-3.5 text-white/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="absolute right-3 top-3.5 text-white/30 text-sm">
            Press '/' to search
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dateFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => setDateFilter('all')}
          >
            All Dates
          </motion.button>
          
          {/* Date filter buttons would go here */}
          {Array.from(new Set(appointments.map(a => a.date))).slice(0, 5).map(date => (
            <motion.button
              key={date}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateFilter === date 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setDateFilter(date)}
            >
              {date}
            </motion.button>
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
      
      {/* Appointments List */}
      <motion.div variants={containerVariants} className="space-y-8">
        {Object.entries(filteredAppointments).length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="text-center py-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl"
          >
            <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-medium text-white/70">No appointments found</h3>
            <p className="text-white/50 mt-2">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          Object.entries(filteredAppointments).map(([date, appointments]) => (
            <motion.div key={date} variants={itemVariants} className="space-y-4">
              <h2 className="text-xl font-semibold text-white/90 px-2">{date}</h2>
              <div className="space-y-3">
                {appointments.map(appointment => (
                  <motion.div
                    key={appointment.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsDetailsModalOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {appointment.patientName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{appointment.patientName}</h3>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <span>{appointment.time}</span>
                            <span>•</span>
                            <span>{appointment.duration} min</span>
                            <span>•</span>
                            <span>{appointment.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white/70">{appointment.doctor}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getStatusColor(appointment.status)}-500/20 text-${getStatusColor(appointment.status)}-400`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
      
      {/* Appointment Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedAppointment && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-black/40 backdrop-blur-xl p-6 rounded-xl shadow-[0_0_25px_rgba(59,130,246,0.3)] w-full max-w-2xl relative z-10 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                      Appointment Details
                    </span>
                  </h2>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white text-lg font-medium">{selectedAppointment.patientName}</h3>
                    <div className={`px-3 py-1 rounded-full bg-${getStatusColor(selectedAppointment.status)}-500/20 text-${getStatusColor(selectedAppointment.status)}-400`}>
                      {selectedAppointment.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white/80 mb-2 font-medium">Appointment Information</h4>
                      <div className="bg-white/5 rounded-lg px-4 py-3 text-white/90 border border-white/10 space-y-2">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{selectedAppointment.date}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{selectedAppointment.time} ({selectedAppointment.duration} minutes)</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{selectedAppointment.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white/80 mb-2 font-medium">Doctor Information</h4>
                      <div className="bg-white/5 rounded-lg px-4 py-3 text-white/90 border border-white/10 space-y-2">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{selectedAppointment.doctor}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Room {selectedAppointment.room || 'Not assigned'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white/80 mb-2 font-medium">Notes</h4>
                    <div className="bg-white/5 rounded-lg px-4 py-3 text-white/90 border border-white/10">
                      <p>{selectedAppointment.notes || 'No notes available'}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEditClick}
                      className="px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/15 hover:text-white transition-colors"
                    >
                      Edit
                    </motion.button>
                    
                    {selectedAppointment.status !== 'canceled' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCancelAppointment}
                        className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        Cancel Appointment
                      </motion.button>
                    )}
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg shadow-lg"
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
      
      {/* Schedule Appointment Modal */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <ScheduleAppointmentModal
            show={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            onSave={handleScheduleAppointment}
          />
        )}
      </AnimatePresence>
      
      {/* Edit Appointment Modal */}
      <AnimatePresence>
        {isEditModalOpen && appointmentToEdit && (
          <ScheduleAppointmentModal
            show={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateAppointment}
            initialData={appointmentToEdit}
            isEditing={true}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Appointments; 