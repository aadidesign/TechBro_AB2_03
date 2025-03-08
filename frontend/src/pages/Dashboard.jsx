import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dashboardData from '../data/dashboardData';

// Animation variants
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const glowVariants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 0.7, 0.5],
    transition: { 
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState({});

  useEffect(() => {
    // Load mock data
    setStats(dashboardData.stats);
    setRecentActivity(dashboardData.recentActivity);
    setUpcomingAppointments(dashboardData.upcomingAppointments);
    setHealthMetrics(dashboardData.healthMetrics);
  }, []);

  // Helper function to get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'appointment':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'record':
        return (
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'test':
        return (
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  // Helper function to get icon for stat cards
  const getStatIcon = (icon, color) => {
    const bgColorClass = `bg-${color}-500/10`;
    const textColorClass = `text-${color}-500`;

    switch (icon) {
      case 'patients':
        return (
          <div className={`w-12 h-12 rounded-full ${bgColorClass} flex items-center justify-center`}>
            <svg className={`w-7 h-7 ${textColorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'calendar':
        return (
          <div className={`w-12 h-12 rounded-full ${bgColorClass} flex items-center justify-center`}>
            <svg className={`w-7 h-7 ${textColorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'clock':
        return (
          <div className={`w-12 h-12 rounded-full ${bgColorClass} flex items-center justify-center`}>
            <svg className={`w-7 h-7 ${textColorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'document':
        return (
          <div className={`w-12 h-12 rounded-full ${bgColorClass} flex items-center justify-center`}>
            <svg className={`w-7 h-7 ${textColorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`w-12 h-12 rounded-full ${bgColorClass} flex items-center justify-center`}>
            <svg className={`w-7 h-7 ${textColorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="relative bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10 h-full overflow-auto"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <motion.div 
          variants={glowVariants}
          className="absolute top-0 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          variants={glowVariants}
          className="absolute -bottom-20 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Enhanced Header */}
      <motion.div 
        variants={cardVariants}
        className="relative mb-8"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
          Dashboard
        </h1>
        <p className="text-white/70">Welcome back, Dr. Martin. Here's what's happening today.</p>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            variants={cardVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="relative group bg-black/20 rounded-xl p-5 border border-white/5 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mb-3">{stat.value}</h3>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className={`text-sm px-2 py-1 rounded-full ${
                    stat.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {stat.change}
                </motion.span>
              </div>
              {getStatIcon(stat.icon, stat.color)}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                {getActivityIcon(activity.type)}
                <div>
                  <p className="text-white/90">{activity.message}</p>
                  <span className="text-white/50 text-sm">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Appointments</h2>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-black/30 rounded-lg p-3 hover:bg-black/40 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{appointment.patientName}</h4>
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                    {appointment.purpose}
                  </span>
                </div>
                <div className="flex items-center text-white/70 text-sm">
                  <svg className="w-4 h-4 mr-1 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{appointment.date} at {appointment.time}</span>
                </div>
              </div>
            ))}
            <button className="w-full mt-3 py-2 bg-black/30 border border-white/10 text-white/80 rounded-lg hover:bg-black/40 hover:text-white transition-colors">
              View All Appointments
            </button>
          </div>
        </div>
      </div>

      {/* Patient Growth Chart */}
      <motion.div 
        variants={cardVariants}
        className="bg-white/5 backdrop-blur-lg rounded-xl p-5 border border-white/10"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Patient Growth</h2>
        <div className="h-64 flex items-end justify-between px-2">
          {healthMetrics.patientGrowth && healthMetrics.patientGrowth.map((value, index) => {
            const maxValue = Math.max(...healthMetrics.patientGrowth);
            const height = (value / maxValue) * 100;
            return (
              <motion.div 
                key={index} 
                className="relative group"
                whileHover={{ scale: 1.1 }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {value}
                </div>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-6 bg-gradient-to-t from-[#1E88E5] to-[#00BFA5] rounded-t-sm"
                />
                <div className="text-white/50 text-xs mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Appointment Distribution and Age Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <h2 className="text-xl font-semibold text-white mb-4">Appointment Types</h2>
          <div className="flex justify-center">
            <div className="w-48 h-48">
              {healthMetrics.appointmentDistribution && (
                <div className="relative w-full h-full">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {healthMetrics.appointmentDistribution.map((item, index) => {
                      const total = healthMetrics.appointmentDistribution.reduce((sum, i) => sum + i.value, 0);
                      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                      let startAngle = 0;
                      let endAngle = 0;
                      
                      // Calculate the previous segments
                      for (let i = 0; i < index; i++) {
                        startAngle += (healthMetrics.appointmentDistribution[i].value / total) * 360;
                      }
                      
                      endAngle = startAngle + (item.value / total) * 360;
                      
                      // Convert to radians
                      const startRad = (startAngle - 90) * Math.PI / 180;
                      const endRad = (endAngle - 90) * Math.PI / 180;
                      
                      // Calculate SVG path
                      const x1 = 50 + 40 * Math.cos(startRad);
                      const y1 = 50 + 40 * Math.sin(startRad);
                      const x2 = 50 + 40 * Math.cos(endRad);
                      const y2 = 50 + 40 * Math.sin(endRad);
                      
                      // Large arc flag
                      const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
                      
                      const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                      
                      return (
                        <path 
                          key={index} 
                          d={pathData} 
                          fill={colors[index % colors.length]} 
                          className="hover:opacity-90 transition-opacity cursor-pointer"
                        />
                      );
                    })}
                    <circle cx="50" cy="50" r="20" fill="#111827" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {healthMetrics.appointmentDistribution && healthMetrics.appointmentDistribution.map((item, index) => {
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
              return (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
                  <span className="text-white/80 text-sm">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <h2 className="text-xl font-semibold text-white mb-4">Age Distribution</h2>
          <div className="flex h-48 items-end justify-around">
            {healthMetrics.ageDistribution && Object.entries(healthMetrics.ageDistribution).map(([group, count], index) => {
              const colors = ['from-blue-500 to-blue-700', 'from-green-500 to-green-700', 'from-yellow-500 to-yellow-700', 'from-red-500 to-red-700'];
              const maxValue = Math.max(...Object.values(healthMetrics.ageDistribution));
              const height = (count / maxValue) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center group">
                  <div className="relative mb-1">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {count}%
                    </div>
                    <div 
                      className={`w-12 rounded-t-lg bg-gradient-to-b ${colors[index % colors.length]} shadow-lg hover:w-14 transition-all duration-200`} 
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 text-white/80">{group}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard; 