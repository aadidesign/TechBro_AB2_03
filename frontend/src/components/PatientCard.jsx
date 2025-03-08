import React from 'react';
import PropTypes from 'prop-types';

const PatientCard = ({ patient, onDelete }) => {
  // Add default values and null checks
  const {
    id = '',
    name = 'Unknown',
    age = 0,
    gender = 'unknown',
    contact = 'N/A'
  } = patient || {};

  // Safely format gender display
  const formatGender = (gender) => {
    if (!gender) return 'Unknown';
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  };

  // Get gender-based style
  const getGenderStyle = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'bg-blue-500/20 text-blue-300';
      case 'female':
        return 'bg-pink-500/20 text-pink-300';
      default:
        return 'bg-purple-500/20 text-purple-300';
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-white">{name}</div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getGenderStyle(gender)}`}>
          {formatGender(gender)}
        </span>
      </div>
      
      <div className="text-sm text-white/70 mb-4">
        <p className="mb-1 flex items-center">
          <svg className="w-4 h-4 mr-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span><strong>Age:</strong> {age}</span>
        </p>
        <p className="mb-1 flex items-center">
          <svg className="w-4 h-4 mr-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span><strong>Contact:</strong> {contact}</span>
        </p>
        <p className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          <span><strong>ID:</strong> #{id}</span>
        </p>
      </div>
      
      <div className="flex space-x-2">
        <button 
          className="flex-1 group inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-green-500 to-blue-500 border border-transparent rounded-xl shadow-lg text-xs font-medium text-white hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-all hover:scale-105 active:scale-95"
          onClick={() => window.location.href=`/AI?patientId=${id}`}
        >
          <svg className="w-4 h-4 mr-1 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Suggestion
        </button>
        
        <button 
          onClick={() => onDelete(id)} 
          className="flex-none inline-flex items-center justify-center p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

PatientCard.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    gender: PropTypes.string.isRequired,
    contact: PropTypes.string.isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired
};

export default PatientCard; 