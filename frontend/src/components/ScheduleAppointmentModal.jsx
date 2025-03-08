import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { appointmentTypes, doctors } from '../data/appointmentsData';
import { appointmentService } from '../services/appointmentService';
import { toast } from 'react-hot-toast';

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
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (formData.date && formData.doctor) {
        try {
          setIsLoadingSlots(true);
          setError(null);
          const slots = await appointmentService.getAvailableTimeSlots(
            formData.date,
            formData.doctor
          );
          setAvailableTimeSlots(slots);
        } catch (error) {
          console.error('Failed to fetch time slots:', error);
          setError('Failed to load available time slots');
          toast.error('Failed to load available time slots');
        } finally {
          setIsLoadingSlots(false);
        }
      }
    };

    fetchTimeSlots();
  }, [formData.date, formData.doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      const requiredFields = ['patientName', 'doctor', 'date', 'time', 'type'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in: ${missingFields.join(', ')}`);
        return;
      }

      await onSave(formData);
      onClose();
      toast.success(isEditing ? 'Appointment updated successfully' : 'Appointment scheduled successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to schedule appointment');
    }
  };

  return (
    <AnimatePresence>
      {show && (
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
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                               text-white focus:border-blue-500/50 focus:ring-2 
                               focus:ring-blue-500/20 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-2 text-sm">Time</label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                               text-white focus:border-blue-500/50 focus:ring-2 
                               focus:ring-blue-500/20 transition-all"
                      required
                      disabled={isLoadingSlots || !formData.date || !formData.doctor}
                    >
                      <option value="">
                        {isLoadingSlots 
                          ? 'Loading available slots...' 
                          : !formData.date || !formData.doctor 
                            ? 'Select date and doctor first'
                            : 'Select time'
                        }
                      </option>
                      {availableTimeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    {error && (
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
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
                    <option value="">Select doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
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

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-white/5 text-white/70 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {isEditing ? 'Update Appointment' : 'Schedule Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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