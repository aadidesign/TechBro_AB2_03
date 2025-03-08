import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message }) => {
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
  }, []);

  return (
    <div 
      className={`fixed bottom-4 right-4 bg-black/30 backdrop-blur-md px-4 py-3 rounded-lg shadow-lg transform transition-all duration-500 flex items-center space-x-2 border border-white/10 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-white font-medium">{message}</span>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired
};

export default Notification; 