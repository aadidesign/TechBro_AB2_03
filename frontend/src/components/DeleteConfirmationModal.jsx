import React from 'react';
import PropTypes from 'prop-types';

const DeleteConfirmationModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-md relative z-10 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Confirm Deletion</h2>
          <button 
            className="text-white/70 hover:text-white text-2xl leading-none transition-colors" 
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <div className="mb-6 text-white/80">
          <div className="flex items-center mb-4 bg-red-500/10 p-3 rounded-lg">
            <div className="mr-3 text-red-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-white">
              Are you sure you want to delete this patient record? <br />
              <span className="text-sm text-white/60">This action cannot be undone.</span>
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/15 hover:text-white transition-colors" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all" 
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default DeleteConfirmationModal; 