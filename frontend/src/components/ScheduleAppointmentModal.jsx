import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { appointmentTypes, doctors } from '../data/appointmentsData';

const ScheduleAppointmentModal = ({ show, onClose, onSave, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState(initialData || {
    patientName: '',
    patientId: '',
    date: '',
    time: '',
    duration: '30',
    type: '',
    doctor: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {isEditing ? 'Edit Appointment' : 'Schedule Appointment'}
            </h2>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 mb-2 text-sm">Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white placeholder-white/30 focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
                placeholder="Enter patient name"
                required
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm">Patient ID</label>
              <input
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white placeholder-white/30 focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
                placeholder="Enter patient ID"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-2 text-sm">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                           text-white focus:border-blue-500/50 focus:ring-2 
                           focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2 text-sm">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                           text-white focus:border-blue-500/50 focus:ring-2 
                           focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-2 text-sm">Duration (minutes)</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                           text-white focus:border-blue-500/50 focus:ring-2 
                           focus:ring-blue-500/20 transition-all"
                  required
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 mb-2 text-sm">Appointment Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                           text-white focus:border-blue-500/50 focus:ring-2 
                           focus:ring-blue-500/20 transition-all"
                  required
                >
                  <option value="" className="bg-[#1a1a1a] text-white">Select type</option>
                  {appointmentTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-[#1a1a1a] text-white">
                      {type.label} {type.description && `- ${type.description}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-2 text-xs text-blue-400/80 italic">
              Choose the appropriate appointment type based on patient needs
            </div>
            
            {formData.type && (
              <div className="mt-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-blue-300">
                    {appointmentTypes.find(t => t.value === formData.type)?.description || 
                     `${appointmentTypes.find(t => t.value === formData.type)?.label} appointment`}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-white/70 mb-2 text-sm">Doctor</label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
                required
              >
                <option value="" className="bg-[#1a1a1a] text-white">Select doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.name} className="bg-[#1a1a1a] text-white">
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white placeholder-white/30 focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
                placeholder="Add appointment notes..."
              />
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
                {isEditing ? 'Update Appointment' : 'Schedule Appointment'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

ScheduleAppointmentModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isEditing: PropTypes.bool
};

export default ScheduleAppointmentModal; 