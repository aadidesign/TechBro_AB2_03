export const recentActivities = [
  {
    id: 1,
    type: 'appointment',
    message: 'Dr. Sarah Johnson scheduled an appointment with Emily Wilson',
    time: '10 minutes ago',
    icon: 'calendar',
    color: 'blue'
  },
  {
    id: 2,
    type: 'medical-record',
    message: 'Medical record updated for patient Michael Brown',
    time: '25 minutes ago',
    icon: 'document',
    color: 'emerald'
  },
  {
    id: 3,
    type: 'lab',
    message: 'Lab results received for patient David Clark',
    time: '1 hour ago',
    icon: 'flask',
    color: 'purple'
  },
  {
    id: 4,
    type: 'appointment',
    message: 'Sophia Taylor canceled her appointment for tomorrow',
    time: '2 hours ago',
    icon: 'calendar',
    color: 'blue'
  },
  {
    id: 5,
    type: 'registration',
    message: 'New patient registration: James Miller',
    time: '4 hours ago',
    icon: 'user-plus',
    color: 'emerald'
  },
  {
    id: 6,
    type: 'prescription',
    message: 'Prescription updated for patient Sarah Anderson',
    time: '5 hours ago',
    icon: 'prescription',
    color: 'orange'
  },
  {
    id: 7,
    type: 'lab',
    message: 'MRI scan results uploaded for Robert Wilson',
    time: '6 hours ago',
    icon: 'flask',
    color: 'purple'
  },
  {
    id: 8,
    type: 'medical-record',
    message: 'Vaccination record updated for Emma Thompson',
    time: '8 hours ago',
    icon: 'document',
    color: 'emerald'
  }
];

export const getActivityIcon = (type) => {
  const icons = {
    appointment: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    'medical-record': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    lab: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    prescription: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    'user-plus': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    )
  };
  return icons[type] || icons['medical-record'];
}; 