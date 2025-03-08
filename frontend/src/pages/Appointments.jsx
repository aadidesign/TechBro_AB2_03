import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import appointmentsData, { statusOptions, appointmentTypes, doctors } from '../data/appointmentsData';
import ScheduleAppointmentModal from '../components/ScheduleAppointmentModal';

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
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);

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

  // Add handleScheduleAppointment function inside the Appointments component
  const handleScheduleAppointment = (appointmentData) => {
    const newAppointment = {
      id: Date.now(),
      status: 'scheduled',
      ...appointmentData
    };
    setAppointments([...appointments, newAppointment]);
    setIsScheduleModalOpen(false);
  };

  const handleEditClick = () => {
    setAppointmentToEdit(selectedAppointment);
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleCancelAppointment = () => {
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === selectedAppointment.id 
        ? { ...appointment, status: 'canceled' } 
        : appointment
    );
    
    setAppointments(updatedAppointments);
    setSelectedAppointment({...selectedAppointment, status: 'canceled'});
    
    // Show a confirmation toast or message here if you have a toast system
  };

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen p-6 space-y-8"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Header Section */}
      <div className="relative space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">Appointments</h1>
            <p className="text-slate-400">Manage patient appointments and schedules</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsScheduleModalOpen(true)}
            className="group px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 
                     text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 
                     transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Schedule Appointment
          </motion.button>
        </div>

        {/* Enhanced Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group col-span-1 md:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl 
                          group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 backdrop-blur-xl rounded-xl 
                       border border-white/10 text-white placeholder-white/50
                       focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 
                       transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="flex-1 px-4 py-3.5 bg-slate-800/50 backdrop-blur-xl rounded-xl 
                       border border-white/10 text-white
                       focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 
                       transition-all duration-200"
            >
              <option value="all">All Dates</option>
              {getUniqueDates().map(date => (
                <option key={date} value={date}>{date === 'all' ? 'All Dates' : date}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-3.5 bg-slate-800/50 backdrop-blur-xl rounded-xl 
                       border border-white/10 text-white
                       focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 
                       transition-all duration-200"
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Appointments List */}
      <motion.div 
        variants={listAnimation}
        initial="initial"
        animate="animate"
        className="relative space-y-8"
      >
        {Object.entries(filteredAppointments).map(([date, appointments]) => (
          <div key={date} className="space-y-4">
            <h2 className="text-xl font-semibold text-white/90">{date}</h2>
            <div className="space-y-3">
              {appointments.map(appointment => (
                <motion.div
                  key={appointment.id}
                  variants={itemAnimation}
                  whileHover="hover"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setIsDetailsModalOpen(true);
                  }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-4
                           hover:border-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 
                                    flex items-center justify-center text-white font-semibold">
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
                      <span className={`px-3 py-1 rounded-full text-sm font-medium
                                     bg-${getStatusColor(appointment.status)}-500/20 
                                     text-${getStatusColor(appointment.status)}-400`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

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
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg shadow hover:from-blue-700 hover:to-teal-600 transition-all"
                    onClick={() => setIsDetailsModalOpen(false)}
                  >
                    Close
                  </motion.button>
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