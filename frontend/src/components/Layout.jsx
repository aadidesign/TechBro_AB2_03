import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();
  
  return (
    <motion.div className="flex min-h-screen bg-gradient-to-br from-emerald-900/90 via-blue-900/90 to-teal-900/90">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            opacity: [0.07, 0.14, 0.07],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 -right-40 w-[600px] h-[600px] bg-emerald-400 rounded-full blur-3xl"
        />
      </div>
      
      {/* Content */}
      <div className="flex w-full relative z-10">
        <Sidebar />
        <main className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};

export default Layout; 