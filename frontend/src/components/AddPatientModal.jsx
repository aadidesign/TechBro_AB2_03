import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddPatientModal = ({ onClose, onSave }) => {
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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-md relative z-10 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Patient</h2>
          <button 
            className="text-white/70 hover:text-white text-2xl leading-none transition-colors" 
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                Patient Name
              </label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all" 
                placeholder="Enter patient name" 
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-white/80 mb-1">
                Age
              </label>
              <input 
                type="number" 
                name="age" 
                id="age" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all" 
                placeholder="Enter age" 
                required 
                min="0" 
                max="120"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-white/80 mb-1">
                Gender
              </label>
              <select 
                name="gender" 
                id="gender" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all" 
                required
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="" disabled className="bg-gray-800 text-white">Select gender</option>
                <option value="male" className="bg-gray-800 text-white">Male</option>
                <option value="female" className="bg-gray-800 text-white">Female</option>
                <option value="other" className="bg-gray-800 text-white">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-white/80 mb-1">
                Contact
              </label>
              <input 
                type="text" 
                name="contact" 
                id="contact" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all" 
                placeholder="Enter contact information" 
                required
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/15 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg shadow hover:from-blue-700 hover:to-teal-600 transition-all"
            >
              Save Patient
            </button>
          </div>
        </form>
      </div>
      
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
    </div>
  );
};

AddPatientModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default AddPatientModal; 