import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const AddPatientModal = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    contact: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'age' ? (value === '' ? '' : parseInt(value, 10)) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl font-semibold text-white mb-6">Add New Patient</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 mb-2 text-sm">Patient Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white placeholder-white/30 focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
                placeholder="Enter patient name"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white placeholder-white/30 focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
                placeholder="Enter age"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 
                         transition-all appearance-none"
              >
                <option value="" disabled className="bg-[#1a1a1a]">Select gender</option>
                <option value="male" className="bg-[#1a1a1a]">Male</option>
                <option value="female" className="bg-[#1a1a1a]">Female</option>
                <option value="other" className="bg-[#1a1a1a]">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 
                         text-white placeholder-white/30 focus:border-blue-500/50 focus:ring-2 
                         focus:ring-blue-500/20 transition-all"
                placeholder="Enter contact information"
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
                Save Patient
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

AddPatientModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default AddPatientModal; 