import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import dashboardData from '../data/dashboardData';
import { useTheme } from '../contexts/ThemeContext';
import { IconButton } from '../components/ui/IconButton';
import axios from 'axios'; // Make sure axios is installed: npm install axios

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
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

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseAnimation = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const slideInUp = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

const neonGlow = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.02, 1],
    filter: [
      'brightness(1) blur(4px)',
      'brightness(1.2) blur(8px)',
      'brightness(1) blur(4px)'
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Enhanced Animation Variants
const springTransition = {
  type: "spring",
  stiffness: 200,
  damping: 20
};

const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const hoverSpring = {
  scale: 1.02,
  y: -5,
  transition: springTransition
};

const cardAnimation = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...springTransition,
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// Add these new neon animation variants after the existing animations
const neonPulse = {
  initial: { opacity: 0.5, filter: 'brightness(1)' },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const neonBorderGlow = {
  initial: { 
    boxShadow: '0 0 0 rgba(59, 130, 246, 0)' 
  },
  animate: {
    boxShadow: [
      '0 0 5px rgba(59, 130, 246, 0.3)',
      '0 0 20px rgba(59, 130, 246, 0.5)',
      '0 0 5px rgba(59, 130, 246, 0.3)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Add these new animation variants
const futuristicGlow = {
  initial: { opacity: 0.3, scale: 1 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.02, 1],
    filter: [
      'brightness(1) blur(4px)',
      'brightness(1.2) blur(8px)',
      'brightness(1) blur(4px)'
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const neonText = {
  initial: { textShadow: '0 0 0px rgba(59, 130, 246, 0)' },
  animate: {
    textShadow: [
      '0 0 5px rgba(59, 130, 246, 0.5)',
      '0 0 20px rgba(59, 130, 246, 0.8)',
      '0 0 5px rgba(59, 130, 246, 0.5)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Add these new color-specific animation variants
const oceanGlow = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.02, 1],
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

const Dashboard = () => {
  const { isDark, toggleTheme } = useTheme();
  const [stats, setStats] = useState([]);
  const [patientTrend, setPatientTrend] = useState([]);
  const [appointmentsByDept, setAppointmentsByDept] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [healthMetrics, setHealthMetrics] = useState({
    patientGrowth: [],
    appointmentDistribution: [],
    ageDistribution: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    // Load mock data
    setStats(dashboardData.stats);
    setRecentActivity(dashboardData.recentActivity);
    setUpcomingAppointments(dashboardData.upcomingAppointments);
    setHealthMetrics(dashboardData.healthMetrics);
  }, []);

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold text-white mb-2"
        >
          Dashboard
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="text-white/60"
        >
          Welcome to your healthcare dashboard
        </motion.p>
      </motion.div>

      {/* Stats Grid - Improved spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            variants={cardAnimation}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
              borderColor: "rgba(255, 255, 255, 0.2)"
            }}
            className="relative group backdrop-blur-xl bg-white/5 rounded-xl p-5 border border-white/10 shadow-lg overflow-hidden"
          >
            {/* Card Glow */}
            <motion.div
              variants={oceanGlow}
              className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-teal-500/10 rounded-xl blur-xl"
            />
            
            <div className="relative z-10">
              <div className="flex justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-white mb-3">{stat.value}</h3>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className={`text-sm px-2 py-1 rounded-full ${
                      stat.isPositive 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {stat.change}
                  </motion.span>
                </div>
                {getStatIcon(stat.icon, stat.color)}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity and Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="">
          <RecentActivity />
        </div>

        {/* Upcoming Appointments */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 transition-all hover:bg-white/10"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Upcoming Appointments</h2>
          <div className="space-y-3">
            {upcomingAppointments && upcomingAppointments.map((appointment) => (
              <motion.div 
                key={appointment.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.2)"
                }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{appointment.patientName}</h4>
                  <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                    {appointment.purpose}
                  </span>
                </div>
                <div className="flex items-center text-white/70 text-sm">
                  <svg className="w-4 h-4 mr-1 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{appointment.date} at {appointment.time}</span>
                </div>
              </motion.div>
            ))}
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              className="w-full mt-3 py-2 backdrop-blur-md bg-white/5 border border-white/10 text-white/80 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            >
              View All Appointments
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Patient Growth Chart */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(255, 255, 255, 0.2)"
          }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 transition-all hover:bg-white/10"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Patient Growth</h2>
          <div className="h-64 flex items-end justify-between">
            {healthMetrics.patientGrowth && healthMetrics.patientGrowth.map((count, index) => {
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const month = months[index % 12];
              const maxValue = Math.max(...healthMetrics.patientGrowth);
              const height = (value / maxValue) * 100;
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
                  <div className="text-xs mt-1 text-white/80">{month}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
        
        {/* Age Distribution Chart */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(255, 255, 255, 0.2)"
          }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 transition-all hover:bg-white/10"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Age Distribution</h2>
          <div className="h-64 flex items-end justify-around">
            {healthMetrics.ageDistribution && Object.entries(healthMetrics.ageDistribution).map(([group, count], index) => {
              const maxValue = Math.max(...Object.values(healthMetrics.ageDistribution));
              const height = (count / maxValue) * 100;
              
              return (
                <div key={group} className="flex flex-col items-center group">
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
                  <div className="text-xs text-blue-400/80 font-medium">{count}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 