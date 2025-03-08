import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" }
  };

  const textVariants = {
    expanded: { opacity: 1, display: "block" },
    collapsed: { opacity: 0, display: "none" }
  };

  // Enhanced glow effect for active items
  const activeGlowVariants = {
    initial: { opacity: 0.3 },
    animate: {
      opacity: [0.3, 0.7, 0.3],
      filter: [
        'brightness(1) blur(4px)',
        'brightness(1.3) blur(8px)',
        'brightness(1) blur(4px)'
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Subtle hover animation
  const hoverAnimation = {
    scale: 1.02,
    boxShadow: "0 0 25px rgba(59, 130, 246, 0.25)",
    transition: { duration: 0.2 }
  };

  return (
    <motion.div 
      className="min-h-screen bg-black/15 backdrop-blur-xl border-r border-white/10 shadow-xl relative overflow-hidden z-10"
      variants={sidebarVariants}
      initial="expanded"
      animate={isExpanded ? "expanded" : "collapsed"}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Layered background elements for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-purple-900/5 to-blue-900/10 z-0"></div>
      
      {/* Subtle grid lines */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent top-20"></div>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent bottom-20"></div>
      </div>
      
      <div className="p-4 relative z-10 flex flex-col h-full">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3 mb-10 pl-1">
          <motion.div 
            className="w-11 h-11 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
            }}
          >
            {/* New Ayurvedic/Medical themed logo */}
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Mortar and pestle - traditional Ayurvedic tool */}
              <path d="M12 3C7.58 3 4 4.79 4 7V17C4 19.21 7.58 21 12 21C16.42 21 20 19.21 20 17V7C20 4.79 16.42 3 12 3Z" 
                fill="currentColor" fillOpacity="0.4" />
              <path d="M12 5C8.13 5 5 6.34 5 8V16C5 17.66 8.13 19 12 19C15.87 19 19 17.66 19 16V8C19 6.34 15.87 5 12 5Z" 
                fill="currentColor" fillOpacity="0.2" />
              
              {/* Pestle */}
              <path d="M9.5 4.5L8 9H11L9.5 4.5Z" fill="currentColor" />
              
              {/* Leaf symbol - representing herbal medicine */}
              <path d="M14.5 8C16.5 8 18 9.5 18 11.5C18 13.5 16.5 15 14.5 15C14.5 13 13 11.5 11 11.5C11 9.5 12.5 8 14.5 8Z" 
                fill="currentColor" />
              
              {/* Circular element - representing wholeness/chakra */}
              <circle cx="8.5" cy="13.5" r="1.5" fill="currentColor" />
            </svg>
          </motion.div>
          <motion.span 
            className="text-xl font-bold text-white"
            variants={textVariants}
          >
            VaidyaSathi
          </motion.span>
        </div>

        {/* Toggle button */}
        <motion.button
          className="absolute -right-3 top-20 bg-white/10 backdrop-blur-md border border-white/10 rounded-full p-1.5 hover:bg-white/15 transition-all"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <svg 
            className="w-5 h-5 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {/* Navigation Links */}
        <nav className="space-y-2 mt-2 flex-1 overflow-y-auto pb-20">
          {[
            { path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', text: 'Dashboard' },
            { path: '/patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', text: 'Patients' },
            { path: '/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', text: 'Appointments' },
            { path: '/doctors', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Doctors' },
            { path: '/medicalrecords', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', text: 'Medical Records' },
            { path: '/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', text: 'Reports' },
          ].map((item, index) => (
            <Link to={item.path} key={item.path}>
              <div className="relative">
                {/* Active item glow effect */}
                {isActiveRoute(item.path) && (
                  <motion.div 
                    className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md z-0"
                    variants={activeGlowVariants}
                    initial="initial"
                    animate="animate"
                  />
                )}
                
                <motion.div
                  className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 relative z-10 ${
                    isActiveRoute(item.path) 
                      ? 'bg-gradient-to-r from-green-500/25 to-blue-500/25 border border-white/15 shadow-lg' 
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={hoverAnimation}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`flex items-center ${!isExpanded ? 'justify-center w-full' : ''}`}>
                    <svg 
                      className={`w-5 h-5 ${isActiveRoute(item.path) ? 'text-green-400' : 'text-white/80'} ${!isExpanded ? '' : 'mr-3.5'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                    <motion.span 
                      variants={textVariants}
                      className={`font-medium ${isActiveRoute(item.path) ? 'text-white' : 'text-white/80'}`}
                    >
                      {item.text}
                    </motion.span>
                  </div>
                  
                  {isActiveRoute(item.path) && isExpanded && (
                    <motion.div 
                      className="ml-auto w-1.5 h-6 bg-gradient-to-b from-green-400 to-blue-500 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  )}
                </motion.div>
              </div>
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <motion.div 
            className="flex items-center p-3 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all cursor-pointer"
            whileHover={hoverAnimation}
          >
            <motion.div 
              className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold"
              whileHover={{ boxShadow: "0 0 15px rgba(16, 185, 129, 0.5)" }}
            >
              MD
            </motion.div>
            <motion.div className="ml-3" variants={textVariants}>
              <p className="text-white font-medium">Dr. Martin</p>
              <p className="text-white/60 text-xs">Administrator</p>
            </motion.div>
            {isExpanded && (
              <motion.div className="ml-auto">
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar; 