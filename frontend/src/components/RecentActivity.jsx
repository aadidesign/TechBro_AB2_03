import React from 'react';
import { motion } from 'framer-motion';

const recentActivities = [
  {
    id: 1,
    icon: 'calendar',
    message: 'Dr. Sarah Johnson scheduled an appointment with Emily Wilson',
    time: '10 minutes ago',
    color: 'blue'
  },
  {
    id: 2,
    icon: 'document',
    message: 'Medical record updated for patient Michael Brown',
    time: '25 minutes ago',
    color: 'emerald'
  },
  {
    id: 3,
    icon: 'flask',
    message: 'Lab results received for patient David Clark',
    time: '1 hour ago',
    color: 'purple'
  },
  {
    id: 4,
    icon: 'calendar-x',
    message: 'Sophia Taylor canceled her appointment for tomorrow',
    time: '2 hours ago',
    color: 'red'
  },
  {
    id: 5,
    icon: 'user-plus',
    message: 'New patient registration: James Miller',
    time: '4 hours ago',
    color: 'emerald'
  }
];

const ActivityItem = ({ activity }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] 
                 border border-white/[0.05] transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-${activity.color}-500/10`}>
          <ActivityIcon type={activity.icon} color={activity.color} />
        </div>
        <div className="flex-1">
          <p className="text-white/90">{activity.message}</p>
          <p className="text-slate-400 text-sm mt-1">{activity.time}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityIcon = ({ type, color }) => {
  // Icon components based on type
  const icons = {
    calendar: (
      <svg className={`w-5 h-5 text-${color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    document: (
      <svg className={`w-5 h-5 text-${color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    flask: (
      <svg className={`w-5 h-5 text-${color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    'user-plus': (
      <svg className={`w-5 h-5 text-${color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    )
  };
  return icons[type] || icons.document;
};

const RecentActivity = () => {
  return (
    <motion.div 
      className="h-full rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.05]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2 
                        scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {recentActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RecentActivity; 