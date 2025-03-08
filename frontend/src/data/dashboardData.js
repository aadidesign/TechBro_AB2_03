// Mock data for Dashboard
const dashboardData = {
  stats: [
    {
      id: 1,
      title: "Total Patients",
      value: 1248,
      change: "+12%",
      isPositive: true,
      icon: "patients",
      color: "blue"
    },
    {
      id: 2,
      title: "Appointments",
      value: 42,
      change: "+7%",
      isPositive: true,
      icon: "calendar",
      color: "green"
    },
    {
      id: 3,
      title: "Avg. Wait Time",
      value: "18 min",
      change: "-2 min",
      isPositive: true,
      icon: "clock",
      color: "indigo"
    },
    {
      id: 4,
      title: "Pending Reports",
      value: 8,
      change: "+3",
      isPositive: false,
      icon: "document",
      color: "red"
    }
  ],
  recentActivity: [
    {
      id: 1,
      type: "appointment",
      message: "Dr. Sarah Johnson scheduled an appointment with Emily Wilson",
      time: "10 minutes ago"
    },
    {
      id: 2,
      type: "record",
      message: "Medical record updated for patient Michael Brown",
      time: "25 minutes ago"
    },
    {
      id: 3,
      type: "test",
      message: "Lab results received for patient David Clark",
      time: "1 hour ago"
    },
    {
      id: 4,
      type: "appointment",
      message: "Sophia Taylor canceled her appointment for tomorrow",
      time: "2 hours ago"
    },
    {
      id: 5,
      type: "record",
      message: "New patient registration: James Miller",
      time: "4 hours ago"
    }
  ],
  upcomingAppointments: [
    {
      id: 1,
      patientName: "Emily Johnson",
      patientId: 1,
      time: "09:00 AM",
      date: "Today",
      purpose: "Follow-up"
    },
    {
      id: 2,
      patientName: "Michael Smith",
      patientId: 2,
      time: "11:30 AM",
      date: "Today",
      purpose: "Consultation"
    },
    {
      id: 3,
      patientName: "Sophia Williams",
      patientId: 3,
      time: "02:15 PM",
      date: "Tomorrow",
      purpose: "Check-up"
    },
    {
      id: 4,
      patientName: "Daniel Brown",
      patientId: 4,
      time: "10:45 AM",
      date: "Tomorrow",
      purpose: "Lab Results"
    }
  ],
  healthMetrics: {
    patientGrowth: [32, 45, 38, 52, 48, 60, 55, 70, 68, 82, 78, 90],
    appointmentDistribution: [
      { name: "Consultation", value: 45 },
      { name: "Follow-up", value: 30 },
      { name: "Check-up", value: 15 },
      { name: "Emergency", value: 10 }
    ],
    ageDistribution: {
      "0-18": 15,
      "19-35": 32,
      "36-50": 28,
      "51+": 25
    }
  }
};

export default dashboardData; 