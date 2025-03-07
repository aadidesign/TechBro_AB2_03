import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import dashboardData from '../data/dashboardData';
import { useTheme } from '../contexts/ThemeContext';
import { IconButton } from '../components/ui/IconButton';
import RecentActivity from '../components/RecentActivity';
import axios from 'axios'; // Make sure axios is installed: npm install axios

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
    opacity: [0.3, 0.5, 0.3],
    transition: {
      duration: 3,
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
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
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
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3000/api/dashboard');
        const data = response.data;
        
        setStats(data.stats || []);
        setRecentActivity(data.recentActivity || []);
        setUpcomingAppointments(data.upcomingAppointments || []);
        setHealthMetrics({
          patientGrowth: data.healthMetrics?.patientGrowth || [],
          appointmentDistribution: data.healthMetrics?.appointmentDistribution || [],
          ageDistribution: data.healthMetrics?.ageDistribution || {}
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
    const iconComponents = {
      patients: (
        <div className={`w-12 h-12 rounded-full bg-${color}-500/10 flex items-center justify-center`}>
          <svg className={`w-7 h-7 text-${color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      ),
      calendar: (
        <div className={`w-12 h-12 rounded-full bg-${color}-500/10 flex items-center justify-center`}>
          <svg className={`w-7 h-7 text-${color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ),
      clock: (
        <div className={`w-12 h-12 rounded-full bg-${color}-500/10 flex items-center justify-center`}>
          <svg className={`w-7 h-7 text-${color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      document: (
        <div className={`w-12 h-12 rounded-full bg-${color}-500/10 flex items-center justify-center`}>
          <svg className={`w-7 h-7 text-${color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      )
    };

    return iconComponents[icon] || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 px-2">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <motion.div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Welcome back, Dr. Martin</p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats && stats.map((stat) => (
          <motion.div
            key={stat.id}
            whileHover={{ 
              scale: 1.02,
              transition: { type: "spring", stiffness: 300 }
            }}
            className="relative group backdrop-blur-xl bg-white/5 rounded-xl p-5 border border-white/10 shadow-lg overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex justify-between">
                <div>
                  <p className="text-emerald-100/70 text-sm mb-1">{stat.title}</p>
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
      </div>

      {/* Activity and Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent Activity */}
        <div className="">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity && recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/5"
              >
                <div className="flex items-start space-x-4">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-white">{activity.message}</p>
                    <p className="text-sm text-white/50 mt-1">{activity.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <motion.div className="space-y-6">
          <h2 className="text-xl font-semibold text-white mb-6">Upcoming Appointments</h2>
          <div className="space-y-3">
            {upcomingAppointments && upcomingAppointments.map((appointment) => (
              <motion.div 
                key={appointment._id}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-md bg-white/5 rounded-lg p-3 border border-white/5 hover:bg-white/10 transition-colors mb-3"
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
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Patient Growth Chart */}
        <motion.div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6">Patient Growth</h2>
          <div className="h-64 flex items-end justify-between px-2">
            {healthMetrics.patientGrowth && healthMetrics.patientGrowth.map((value, index) => {
              const maxValue = Math.max(...healthMetrics.patientGrowth);
              const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
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

        {/* Age Distribution Chart */}
        <motion.div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6">Age Distribution</h2>
          <div className="flex h-48 items-end justify-around">
            {healthMetrics.ageDistribution && Object.entries(healthMetrics.ageDistribution).map(([group, count], index) => {
              const colors = ['from-blue-500 to-blue-700', 'from-green-500 to-green-700', 'from-yellow-500 to-yellow-700', 'from-red-500 to-red-700'];
              const maxValue = Math.max(...Object.values(healthMetrics.ageDistribution));
              const height = maxValue > 0 ? (count / maxValue) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center group">
                  <div className="relative mb-1">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {count}
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
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 