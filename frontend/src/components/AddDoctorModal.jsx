import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const AddDoctorModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    credentials: 'MD',
    experience: '',
    bio: '',
    email: '',
    phone: '',
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }
  });

  const [timeSlots, setTimeSlots] = useState({
    monday: { active: false, slots: [] },
    tuesday: { active: false, slots: [] },
    wednesday: { active: false, slots: [] },
    thursday: { active: false, slots: [] },
    friday: { active: false, slots: [] },
    saturday: { active: false, slots: [] },
    sunday: { active: false, slots: [] }
  });

  // For new time slot inputs
  const [newSlots, setNewSlots] = useState({
    monday: { start: '08:00', end: '12:00', period: 'AM-PM' },
    tuesday: { start: '08:00', end: '12:00', period: 'AM-PM' },
    wednesday: { start: '08:00', end: '12:00', period: 'AM-PM' },
    thursday: { start: '08:00', end: '12:00', period: 'AM-PM' },
    friday: { start: '08:00', end: '12:00', period: 'AM-PM' },
    saturday: { start: '09:00', end: '01:00', period: 'AM-PM' },
    sunday: { start: '09:00', end: '01:00', period: 'AM-PM' }
  });

  const specialties = [
    'General Medicine',
    'Cardiology',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
    'Dermatology',
    'Psychiatry',
    'Ophthalmology',
    'Gynecology',
    'Urology'
  ];

  const credentials = ['MD', 'MD, PhD', 'DO', 'MBBS', 'DNP'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayToggle = (day) => {
    const newTimeSlots = { ...timeSlots };
    newTimeSlots[day].active = !newTimeSlots[day].active;
    setTimeSlots(newTimeSlots);

    // Update availability in formData
    const newAvailability = { ...formData.availability };
    if (!newTimeSlots[day].active) {
      newAvailability[day] = [];
    }

    setFormData(prev => ({
      ...prev,
      availability: newAvailability
    }));
  };

  const handleSlotChange = (day, field, value) => {
    setNewSlots(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const addTimeSlot = (day) => {
    const slot = newSlots[day];
    const formattedSlot = `${slot.start} ${slot.period.split('-')[0]} - ${slot.end} ${slot.period.split('-')[1]}`;
    
    // Update timeSlots state
    const updatedTimeSlots = { ...timeSlots };
    updatedTimeSlots[day].slots = [...updatedTimeSlots[day].slots, formattedSlot];
    setTimeSlots(updatedTimeSlots);
    
    // Update formData availability
    const updatedAvailability = { ...formData.availability };
    updatedAvailability[day] = [...updatedTimeSlots[day].slots];
    
    setFormData(prev => ({
      ...prev,
      availability: updatedAvailability
    }));
  };

  const removeTimeSlot = (day, index) => {
    const updatedTimeSlots = { ...timeSlots };
    updatedTimeSlots[day].slots = updatedTimeSlots[day].slots.filter((_, i) => i !== index);
    setTimeSlots(updatedTimeSlots);
    
    // Update formData availability
    const updatedAvailability = { ...formData.availability };
    updatedAvailability[day] = [...updatedTimeSlots[day].slots];
    
    setFormData(prev => ({
      ...prev,
      availability: updatedAvailability
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-3xl w-full shadow-xl relative z-10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Add New Doctor</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/70 mb-2 text-sm">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
                required
                placeholder="Dr. Full Name"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm">Specialty</label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
                required
              >
                <option value="" className="bg-[#1a1a1a] text-white">Select specialty</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty} className="bg-[#1a1a1a] text-white">
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm">Credentials</label>
              <select
                name="credentials"
                value={formData.credentials}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
              >
                {credentials.map(cred => (
                  <option key={cred} value={cred} className="bg-[#1a1a1a] text-white">
                    {cred}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm">Years of Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
                required
                min="0"
                placeholder="Years of experience"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
                required
                placeholder="doctor@medportal.com"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
                required
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 mb-2 text-sm">Biography</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                       text-white focus:border-blue-500/50 focus:ring-2 
                       focus:ring-blue-500/20 transition-all"
              required
              placeholder="Doctor's professional biography and specializations..."
            />
          </div>

          <div>
            <label className="block text-white/70 mb-3 text-sm">Availability</label>
            <div className="space-y-4">
              {Object.keys(timeSlots).map(day => (
                <div key={day} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={timeSlots[day].active}
                        onChange={() => handleDayToggle(day)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-white capitalize">{day}</span>
                    </label>
                    
                    {timeSlots[day].active && (
                      <div className="text-xs text-blue-300">
                        {timeSlots[day].slots.length} time slot(s)
                      </div>
                    )}
                  </div>
                  
                  {timeSlots[day].active && (
                    <div className="mt-3 space-y-3">
                      {/* Display existing time slots */}
                      {timeSlots[day].slots.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {timeSlots[day].slots.map((slot, index) => (
                            <div key={index} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-md flex items-center">
                              {slot}
                              <button 
                                type="button"
                                onClick={() => removeTimeSlot(day, index)}
                                className="ml-2 text-blue-300 hover:text-blue-100"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add new time slot */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={newSlots[day].start}
                            onChange={(e) => handleSlotChange(day, 'start', e.target.value)}
                            className="w-16 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                            placeholder="08:00"
                          />
                          <select
                            value={newSlots[day].period.split('-')[0]}
                            onChange={(e) => handleSlotChange(day, 'period', `${e.target.value}-${newSlots[day].period.split('-')[1]}`)}
                            className="ml-1 px-1 py-1 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                          >
                            <option value="AM" className="bg-[#1a1a1a] text-white">AM</option>
                            <option value="PM" className="bg-[#1a1a1a] text-white">PM</option>
                          </select>
                        </div>
                        
                        <span className="text-white/50">to</span>
                        
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={newSlots[day].end}
                            onChange={(e) => handleSlotChange(day, 'end', e.target.value)}
                            className="w-16 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                            placeholder="12:00"
                          />
                          <select
                            value={newSlots[day].period.split('-')[1]}
                            onChange={(e) => handleSlotChange(day, 'period', `${newSlots[day].period.split('-')[0]}-${e.target.value}`)}
                            className="ml-1 px-1 py-1 rounded-md bg-white/5 border border-white/10 text-white text-sm"
                          >
                            <option value="AM" className="bg-[#1a1a1a] text-white">AM</option>
                            <option value="PM" className="bg-[#1a1a1a] text-white">PM</option>
                          </select>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => addTimeSlot(day)}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-sm hover:bg-blue-500/30 transition-colors"
                        >
                          Add Slot
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 
                       hover:text-white border border-white/10 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/80 to-cyan-600/80 
                       text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 
                       transition-all"
            >
              Add Doctor
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

AddDoctorModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default AddDoctorModal; 