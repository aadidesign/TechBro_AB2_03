import React from 'react';
import { motion } from 'framer-motion';

const UpcomingAppointments = () => {
  return (
    <motion.div 
      className="h-full rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.05]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Upcoming Appointments</h2>
        <div className="space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2 
                        scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {upcomingAppointments.map((appointment) => (
            <AppointmentItem key={appointment._id} appointment={appointment} />
          ))}
          <motion.button
            whileHover={{ scale: 1.01 }}
            className="w-full mt-6 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] 
                       border border-white/[0.05] text-white/70 hover:text-white 
                       transition-all duration-300 flex items-center justify-center gap-2"
          >
            View All Appointments
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}; 