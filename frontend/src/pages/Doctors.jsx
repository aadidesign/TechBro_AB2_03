import React, { useState, useEffect } from 'react';
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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Load doctors data
  useEffect(() => {
    setDoctors(doctorsData);
  }, []);

  // Filter doctors based on search term, specialty and status
  useEffect(() => {
    let filtered = [...doctors];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.qualification.toLowerCase().includes(searchTerm.toLowerCase())
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
    const statusOption = statusOptions.find(option => option.value === status);
    if (!statusOption) return 'gray';
    return statusOption.color;
  };

  // View doctor profile
  const viewDoctorProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setIsProfileModalOpen(true);
  };

  // Handle adding a new doctor
  const handleAddDoctor = (newDoctor) => {
    // Generate a new ID for the doctor
    const newId = Math.max(...doctors.map(d => d.id)) + 1;
    const doctorWithId = {
      ...newDoctor,
      id: newId,
      rating: 0,
      patients: 0,
      status: 'active'
    };
    
    setDoctors([...doctors, doctorWithId]);
    setIsAddDoctorModalOpen(false);
  };

  // Handle editing a doctor's profile
  const handleEditProfile = () => {
    setIsProfileModalOpen(false);
    setIsEditProfileModalOpen(true);
  };

  // Handle updating a doctor's profile
  const handleUpdateDoctor = (updatedDoctor) => {
    const updatedDoctors = doctors.map(doctor => 
      doctor.id === updatedDoctor.id ? { ...doctor, ...updatedDoctor } : doctor
    );
    
    setDoctors(updatedDoctors);
    setSelectedDoctor({ ...selectedDoctor, ...updatedDoctor });
    setIsEditProfileModalOpen(false);
    setIsProfileModalOpen(true);
  };

  // Handle scheduling an appointment with the doctor
  const handleScheduleAppointment = () => {
    setIsProfileModalOpen(false);
    setIsScheduleModalOpen(true);
  };

  // Handle saving a new appointment
  const handleSaveAppointment = (appointmentData) => {
    // Here you would typically save the appointment to your appointments data
    // For now, we'll just close the modal
    setIsScheduleModalOpen(false);
    setIsProfileModalOpen(true); // Return to the doctor profile
  };

  // Format availability for display
  const formatAvailability = (availability) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => {
      const slots = availability[day];
      if (!slots || slots.length === 0) return null;
      
      return (
        <div key={day} className="mb-2">
          <span className="capitalize text-white/80">{day}: </span>
          <span className="text-white/60">{slots.join(', ')}</span>
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 h-full overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Doctors</h1>
          <p className="text-white/70">View and manage doctor profiles</p>
        </div>

        <div className="flex space-x-3">
          <div className="flex bg-black/20 rounded-lg p-1">
            <button 
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white/10' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white/10' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <button 
            onClick={() => setIsAddDoctorModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg 
                     flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 
                     hover:from-blue-700 hover:to-teal-600 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Doctor
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all" 
            placeholder="Search doctors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
        >
          <option value="all" className="bg-gray-800">All Specialties</option>
          {specialties.map((specialty, index) => (
            <option key={index} value={specialty} className="bg-gray-800">
              {specialty}
            </option>
          ))}
        </select>

        <select 
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all" className="bg-gray-800">All Status</option>
          {statusOptions.map((option, index) => (
            <option key={index} value={option.value} className="bg-gray-800">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Doctors List */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-black/20 rounded-xl p-10 text-center border border-white/5">
          <svg className="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="text-xl font-medium text-white mb-2">No doctors found</h3>
          <p className="text-white/70">Try changing your filters or add a new doctor</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div 
              key={doctor.id} 
              className="bg-black/20 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all hover-lift cursor-pointer"
              onClick={() => viewDoctorProfile(doctor)}
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-semibold mr-4">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{doctor.name}</h3>
                  <p className="text-white/70">{doctor.specialty}</p>
                  <div className={`mt-1 inline-block px-2 py-1 text-xs rounded-full bg-${getStatusColor(doctor.status)}-500/20 text-${getStatusColor(doctor.status)}-400 capitalize`}>
                    {doctor.status.replace('_', ' ')}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-white/70 text-sm">
                  <svg className="w-4 h-4 mr-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{doctor.qualification}</span>
                </div>
                <div className="flex items-center text-white/70 text-sm">
                  <svg className="w-4 h-4 mr-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{doctor.experience} years experience</span>
                </div>
                <div className="flex items-center text-white/70 text-sm">
                  <svg className="w-4 h-4 mr-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{doctor.patients} patients</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star} 
                      className={`w-4 h-4 ${star <= Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-400'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-white/70 text-sm">{doctor.rating}</span>
                </div>
                
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDoctors.map((doctor) => (
            <div 
              key={doctor.id} 
              className="bg-black/20 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
              onClick={() => viewDoctorProfile(doctor)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{doctor.name}</h3>
                    <div className="flex items-center text-white/70 text-sm">
                      <span>{doctor.specialty}</span>
                      <span className="mx-2">•</span>
                      <span>{doctor.qualification}</span>
                      <span className="mx-2">•</span>
                      <span>{doctor.experience} yrs exp.</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className={`w-4 h-4 ${star <= Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-400'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-white/70 text-sm">{doctor.rating}</span>
                  </div>
                  
                  <div className={`px-2 py-1 text-xs rounded-full bg-${getStatusColor(doctor.status)}-500/20 text-${getStatusColor(doctor.status)}-400 capitalize`}>
                    {doctor.status.replace('_', ' ')}
                  </div>
                  
                  <button className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Profile Modal */}
      {isProfileModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsProfileModalOpen(false)}></div>
          <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-4xl w-full shadow-xl">
            <button 
              onClick={() => setIsProfileModalOpen(false)} 
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-semibold text-white mb-6">Doctor Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-1">{selectedDoctor.name}</h3>
                <p className="text-white/70 mb-4">{selectedDoctor.specialty}</p>
                
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm mb-4">
                  Active
                </div>
                
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg 
                      key={star} 
                      className={`w-4 h-4 ${star <= Math.floor(selectedDoctor.rating) ? 'text-yellow-400' : 'text-gray-500'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-white/70 text-sm">{selectedDoctor.rating}</span>
                </div>
                
                <div className="w-full space-y-3 text-white/80">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{selectedDoctor.qualification}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{selectedDoctor.experience} years experience</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{selectedDoctor.patients} patients</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{selectedDoctor.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{selectedDoctor.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h4 className="text-white/80 mb-2 font-medium">Biography</h4>
                  <div className="bg-black/20 rounded-lg px-4 py-3 text-white/90 border border-white/5">
                    {selectedDoctor.bio}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white/80 mb-2 font-medium">Availability</h4>
                  <div className="bg-black/20 rounded-lg px-4 py-3 text-white/90 border border-white/5">
                    {formatAvailability(selectedDoctor.availability)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button 
                onClick={handleEditProfile}
                className="px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/15 hover:text-white transition-colors"
              >
                Edit Profile
              </button>
              <button 
                onClick={handleScheduleAppointment}
                className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
              >
                Schedule Appointment
              </button>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg shadow hover:from-blue-700 hover:to-teal-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {isAddDoctorModalOpen && (
        <AddDoctorModal
          onClose={() => setIsAddDoctorModalOpen(false)}
          onSave={handleAddDoctor}
        />
      )}
      
      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && selectedDoctor && (
        <AddDoctorModal
          onClose={() => {
            setIsEditProfileModalOpen(false);
            setIsProfileModalOpen(true);
          }}
          onSave={handleUpdateDoctor}
          initialData={selectedDoctor}
          isEditing={true}
        />
      )}
      
      {/* Schedule Appointment Modal */}
      {isScheduleModalOpen && selectedDoctor && (
        <ScheduleAppointmentModal
          show={true}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setIsProfileModalOpen(true);
          }}
          onSave={handleSaveAppointment}
          initialData={{
            doctor: selectedDoctor.name
          }}
        />
      )}
    </div>
  );
};

export default Doctors; 