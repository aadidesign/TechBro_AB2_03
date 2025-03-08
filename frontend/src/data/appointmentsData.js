// Mock data for Appointments
const appointmentsData = [
  {
    id: 1,
    patientName: "Emily Johnson",
    patientId: 1,
    date: "2023-06-15",
    time: "09:00 AM",
    duration: 30,
    status: "confirmed",
    type: "Follow-up",
    doctor: "Dr. Sarah Chen",
    notes: "Patient experiencing mild discomfort, follow-up on previous treatment",
    patientAvatar: null
  },
  {
    id: 2,
    patientName: "Michael Smith",
    patientId: 2,
    date: "2023-06-15",
    time: "11:30 AM",
    duration: 45,
    status: "confirmed",
    type: "Consultation",
    doctor: "Dr. James Wilson",
    notes: "Initial consultation for back pain",
    patientAvatar: null
  },
  {
    id: 3,
    patientName: "Sophia Williams",
    patientId: 3,
    date: "2023-06-15",
    time: "02:15 PM",
    duration: 30,
    status: "canceled",
    type: "Check-up",
    doctor: "Dr. Sarah Chen",
    notes: "Annual check-up",
    patientAvatar: null
  },
  {
    id: 4,
    patientName: "Daniel Brown",
    patientId: 4,
    date: "2023-06-16",
    time: "10:45 AM",
    duration: 30,
    status: "confirmed",
    type: "Lab Results",
    doctor: "Dr. Mark Johnson",
    notes: "Review recent lab results",
    patientAvatar: null
  },
  {
    id: 5,
    patientName: "Olivia Davis",
    patientId: 5,
    date: "2023-06-16",
    time: "01:00 PM",
    duration: 60,
    status: "pending",
    type: "Consultation",
    doctor: "Dr. James Wilson",
    notes: "Consultation for respiratory issues",
    patientAvatar: null
  },
  {
    id: 6,
    patientName: "James Miller",
    patientId: 6,
    date: "2023-06-17",
    time: "11:15 AM",
    duration: 30,
    status: "confirmed",
    type: "Follow-up",
    doctor: "Dr. Mark Johnson",
    notes: "Follow-up on medication",
    patientAvatar: null
  },
  {
    id: 7,
    patientName: "Ava Wilson",
    patientId: 7,
    date: "2023-06-17",
    time: "03:30 PM",
    duration: 45,
    status: "confirmed",
    type: "Consultation",
    doctor: "Dr. Sarah Chen",
    notes: "New patient consultation",
    patientAvatar: null
  },
  {
    id: 8,
    patientName: "Ethan Moore",
    patientId: 8,
    date: "2023-06-18",
    time: "09:30 AM",
    duration: 30,
    status: "pending",
    type: "Check-up",
    doctor: "Dr. James Wilson",
    notes: "Routine check-up for elderly patient",
    patientAvatar: null
  },
  {
    id: 9,
    patientName: "Alex Taylor",
    patientId: 9,
    date: "2023-06-18",
    time: "02:00 PM",
    duration: 30,
    status: "confirmed",
    type: "Follow-up",
    doctor: "Dr. Mark Johnson",
    notes: "Follow-up after surgery",
    patientAvatar: null
  }
];

// Types of appointments
export const appointmentTypes = [
  { 
    value: "consultation", 
    label: "Consultation", 
    description: "Initial assessment of symptoms or concerns",
    icon: "stethoscope",
    duration: 45
  },
  { 
    value: "followup", 
    label: "Follow-up", 
    description: "Review progress after previous treatment",
    icon: "clipboard-check",
    duration: 30
  },
  { 
    value: "checkup", 
    label: "Check-up", 
    description: "Regular health assessment and monitoring",
    icon: "heart-pulse",
    duration: 30
  },
  { 
    value: "labresults", 
    label: "Lab Results", 
    description: "Review and discuss laboratory test results",
    icon: "flask",
    duration: 15
  },
  { 
    value: "vaccination", 
    label: "Vaccination", 
    description: "Scheduled immunization or vaccine administration",
    icon: "syringe",
    duration: 15
  },
  { 
    value: "surgery", 
    label: "Surgery", 
    description: "Pre-surgical consultation or post-surgical follow-up",
    icon: "scalpel",
    duration: 60
  },
  { 
    value: "emergency", 
    label: "Emergency", 
    description: "Urgent care for acute conditions",
    icon: "ambulance",
    duration: 60
  },
  { 
    value: "therapy", 
    label: "Therapy", 
    description: "Ongoing treatment for chronic conditions",
    icon: "hand-holding-medical",
    duration: 45
  }
];

// Status options
export const statusOptions = [
  { value: "confirmed", label: "Confirmed", color: "green" },
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "canceled", label: "Canceled", color: "red" },
  { value: "completed", label: "Completed", color: "blue" }
];

// Time slots
export const timeSlots = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", 
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
];

// Doctors
export const doctors = [
  { id: 1, name: "Dr. Sarah Chen", specialty: "General Medicine" },
  { id: 2, name: "Dr. James Wilson", specialty: "Cardiology" },
  { id: 3, name: "Dr. Mark Johnson", specialty: "Orthopedics" },
  { id: 4, name: "Dr. Emily Roberts", specialty: "Pediatrics" },
  { id: 5, name: "Dr. Michael Thompson", specialty: "Neurology" }
];

export default appointmentsData; 