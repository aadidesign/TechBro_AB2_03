import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import appointmentsData, { statusOptions, appointmentTypes, doctors } from '../data/appointmentsData';

// Animation variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  },
  exit: { opacity: 0, y: -20 }
};

const listAnimation = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemAnimation = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  hover: { 
    scale: 1.02,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transition: { duration: 0.2 }
  }
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Load appointments data
  useEffect(() => {
    setAppointments(appointmentsData);
  }, []);

  // Filter appointments based on search term, date and status
  useEffect(() => {
    let filtered = [...appointments];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(appointment => 
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    // Group appointments by date
    const groupedAppointments = filtered.reduce((groups, appointment) => {
      const date = appointment.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(appointment);
      return groups;
    }, {});
    
    // Sort appointments by time within each date group
    Object.keys(groupedAppointments).forEach(date => {
      groupedAppointments[date].sort((a, b) => {
        const timeA = new Date(`2000/01/01 ${a.time}`);
        const timeB = new Date(`2000/01/01 ${b.time}`);
        return timeA - timeB;
      });
    });
    
    setFilteredAppointments(groupedAppointments);
  }, [appointments, searchTerm, dateFilter, statusFilter]);

  // Generate unique dates for filter dropdown
  const getUniqueDates = () => {
    const dates = appointments.map(appointment => appointment.date);
    return ['all', ...new Set(dates)].sort();
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    if (!statusOption) return 'gray';
    return statusOption.color;
  };

  // Handle view appointment details
  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  // Format date to readable format (2023-06-15 -> June 15, 2023)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="relative bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10 h-full overflow-auto"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
            Appointments
          </h1>
          <p className="text-white/70">Manage patient appointments and schedules</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-6 py-3 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center">
            <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-white font-medium">Schedule Appointment</span>
          </div>
          <div className="absolute inset-0 ring-2 ring-white/20 rounded-xl"></div>
        </motion.button>
      </motion.div>

      {/* Enhanced Filters & Search */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            placeholder="Search appointments..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white appearance-none hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all" className="bg-gray-900">All Dates</option>
          {getUniqueDates().map((date, index) => (
            date !== 'all' && (
              <option key={index} value={date} className="bg-gray-900">
                {formatDate(date)}
              </option>
            )
          ))}
        </select>

        <select 
          className="bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white appearance-none hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all" className="bg-gray-900">All Status</option>
          {statusOptions.map((option, index) => (
            <option key={index} value={option.value} className="bg-gray-900">
              {option.label}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Appointments List */}
      <AnimatePresence>
        <motion.div 
          variants={listAnimation}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {Object.keys(filteredAppointments).length === 0 ? (
            <div className="bg-black/20 rounded-xl p-10 text-center border border-white/5">
              <svg className="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-medium text-white mb-2">No appointments found</h3>
              <p className="text-white/70">Try changing your filters or create a new appointment</p>
            </div>
          ) : (
            Object.keys(filteredAppointments).sort().map((date) => (
              <div key={date} className="bg-black/20 rounded-xl p-5 border border-white/5">
                <h3 className="text-white font-semibold mb-4">{formatDate(date)}</h3>
                <div className="space-y-3">
                  {filteredAppointments[date].map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="bg-black/30 rounded-lg p-4 border border-white/5 hover:bg-black/40 transition-colors cursor-pointer"
                      onClick={() => viewAppointmentDetails(appointment)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                            {appointment.patientName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{appointment.patientName}</h4>
                            <div className="flex items-center text-white/70 text-sm">
                              <svg className="w-4 h-4 mr-1 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{appointment.time} • {appointment.duration} min</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-white/70">{appointment.type}</span>
                          <span className="text-sm text-white/70">•</span>
                          <span className="text-sm text-white/70">{appointment.doctor}</span>
                          <span className={`px-2 py-1 text-xs rounded-full bg-${getStatusColor(appointment.status)}-500/20 text-${getStatusColor(appointment.status)}-400 capitalize`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedAppointment && (
          <>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="glassmorphism p-6 rounded-xl shadow-lg w-full max-w-2xl relative z-10 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Appointment Details</h2>
                  <button 
                    className="text-white/70 hover:text-white text-2xl leading-none transition-colors" 
                    onClick={() => setIsDetailsModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                        {selectedAppointment.patientName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{selectedAppointment.patientName}</h3>
                        <p className="text-white/70 text-sm">Patient ID: #{selectedAppointment.patientId}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-white/90">{formatDate(selectedAppointment.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-white/90">{selectedAppointment.time}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-white/90">Duration: {selectedAppointment.duration} minutes</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-white/90">{selectedAppointment.doctor}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <h4 className="text-white/80 mb-2">Appointment Type</h4>
                      <div className="bg-black/20 rounded-lg px-4 py-3 text-white border border-white/5">
                        {selectedAppointment.type}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-white/80 mb-2">Status</h4>
                      <div className={`inline-block px-3 py-1 rounded-full bg-${getStatusColor(selectedAppointment.status)}-500/20 text-${getStatusColor(selectedAppointment.status)}-400 capitalize`}>
                        {selectedAppointment.status}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white/80 mb-2">Notes</h4>
                      <div className="bg-black/20 rounded-lg px-4 py-3 text-white/90 border border-white/5 min-h-[80px]">
                        {selectedAppointment.notes || "No notes for this appointment."}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/15 hover:text-white transition-colors">
                    Edit
                  </button>
                  {selectedAppointment.status !== 'canceled' && (
                    <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors">
                      Cancel Appointment
                    </button>
                  )}
                  <button 
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg shadow hover:from-blue-700 hover:to-teal-600 transition-all"
                    onClick={() => setIsDetailsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsDetailsModalOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Appointments; 