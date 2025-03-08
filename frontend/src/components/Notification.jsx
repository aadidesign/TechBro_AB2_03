import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message, type = 'success' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Animate out
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [message]); // Re-run when message changes

  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Get background color based on type
  const getBgColor = () => {
    switch (type) {
      case 'success': return 'border-green-500/20';
      case 'error': return 'border-red-500/20';
      case 'warning': return 'border-yellow-500/20';
      default: return 'border-blue-500/20';
    }
  };

  if (!message) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 bg-black/30 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg transform transition-all duration-500 flex items-center space-x-2 border ${getBgColor()} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {getIcon()}
      <span className="text-white font-medium">{message}</span>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info'])
};

Notification.defaultProps = {
  message: '',
  type: 'success'
};

export default Notification; 