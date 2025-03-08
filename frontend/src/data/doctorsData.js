// Mock data for Doctors
const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    specialty: "General Medicine",
    qualification: "MD",
    experience: 12,
    email: "sarah.chen@medportal.com",
    phone: "+1 (555) 123-4567",
    availability: {
      monday: ["09:00 AM - 01:00 PM", "02:00 PM - 05:00 PM"],
      tuesday: ["09:00 AM - 01:00 PM", "02:00 PM - 05:00 PM"],
      wednesday: ["09:00 AM - 01:00 PM"],
      thursday: ["09:00 AM - 01:00 PM", "02:00 PM - 05:00 PM"],
      friday: ["09:00 AM - 01:00 PM", "02:00 PM - 05:00 PM"],
      saturday: ["10:00 AM - 02:00 PM"],
      sunday: []
    },
    patients: 253,
    rating: 4.8,
    avatar: null,
    bio: "Dr. Sarah Chen is a board-certified physician specializing in primary care and preventive medicine. With 12 years of experience, she is dedicated to providing holistic and patient-centered care.",
    status: "active"
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    specialty: "Cardiology",
    qualification: "MD, PhD",
    experience: 15,
    email: "james.wilson@medportal.com",
    phone: "+1 (555) 234-5678",
    availability: {
      monday: ["10:00 AM - 02:00 PM", "03:00 PM - 06:00 PM"],
      tuesday: ["10:00 AM - 02:00 PM", "03:00 PM - 06:00 PM"],
      wednesday: ["10:00 AM - 02:00 PM", "03:00 PM - 06:00 PM"],
      thursday: ["10:00 AM - 02:00 PM"],
      friday: ["10:00 AM - 02:00 PM", "03:00 PM - 06:00 PM"],
      saturday: [],
      sunday: []
    },
    patients: 189,
    rating: 4.9,
    avatar: null,
    bio: "Dr. James Wilson is a highly skilled cardiologist with a passion for cardiovascular research. He specializes in interventional cardiology and has published numerous papers on heart disease treatment.",
    status: "active"
  },
  {
    id: 3,
    name: "Dr. Mark Johnson",
    specialty: "Orthopedics",
    qualification: "MD",
    experience: 10,
    email: "mark.johnson@medportal.com",
    phone: "+1 (555) 345-6789",
    availability: {
      monday: ["08:00 AM - 12:00 PM", "01:00 PM - 04:00 PM"],
      tuesday: ["08:00 AM - 12:00 PM", "01:00 PM - 04:00 PM"],
      wednesday: ["08:00 AM - 12:00 PM"],
      thursday: ["08:00 AM - 12:00 PM", "01:00 PM - 04:00 PM"],
      friday: ["08:00 AM - 12:00 PM", "01:00 PM - 04:00 PM"],
      saturday: ["09:00 AM - 01:00 PM"],
      sunday: []
    },
    patients: 175,
    rating: 4.7,
    avatar: null,
    bio: "Dr. Mark Johnson is an orthopedic surgeon who specializes in sports medicine and joint replacements. He has worked with several professional sports teams and provides comprehensive care for musculoskeletal issues.",
    status: "active"
  },
  {
    id: 4,
    name: "Dr. Emily Roberts",
    specialty: "Pediatrics",
    qualification: "MD",
    experience: 8,
    email: "emily.roberts@medportal.com",
    phone: "+1 (555) 456-7890",
    availability: {
      monday: ["09:30 AM - 01:30 PM", "02:30 PM - 05:30 PM"],
      tuesday: ["09:30 AM - 01:30 PM", "02:30 PM - 05:30 PM"],
      wednesday: ["09:30 AM - 01:30 PM", "02:30 PM - 05:30 PM"],
      thursday: ["09:30 AM - 01:30 PM"],
      friday: ["09:30 AM - 01:30 PM", "02:30 PM - 05:30 PM"],
      saturday: ["10:00 AM - 02:00 PM"],
      sunday: []
    },
    patients: 210,
    rating: 4.9,
    avatar: null,
    bio: "Dr. Emily Roberts is a compassionate pediatrician who provides comprehensive care for children from newborns to adolescents. She specializes in developmental pediatrics and has a warm, engaging approach with young patients.",
    status: "active"
  },
  {
    id: 5,
    name: "Dr. Michael Thompson",
    specialty: "Neurology",
    qualification: "MD, PhD",
    experience: 14,
    email: "michael.thompson@medportal.com",
    phone: "+1 (555) 567-8901",
    availability: {
      monday: ["08:30 AM - 12:30 PM", "01:30 PM - 04:30 PM"],
      tuesday: ["08:30 AM - 12:30 PM", "01:30 PM - 04:30 PM"],
      wednesday: ["08:30 AM - 12:30 PM"],
      thursday: ["08:30 AM - 12:30 PM", "01:30 PM - 04:30 PM"],
      friday: ["08:30 AM - 12:30 PM", "01:30 PM - 04:30 PM"],
      saturday: [],
      sunday: []
    },
    patients: 168,
    rating: 4.8,
    avatar: null,
    bio: "Dr. Michael Thompson is a renowned neurologist with expertise in treating complex neurological disorders. His research focuses on neurodegenerative diseases, and he takes a holistic approach to patient care.",
    status: "on_leave"
  },
  {
    id: 6,
    name: "Dr. Sophia Miller",
    specialty: "Dermatology",
    qualification: "MD",
    experience: 7,
    email: "sophia.miller@medportal.com",
    phone: "+1 (555) 678-9012",
    availability: {
      monday: ["10:00 AM - 02:00 PM", "03:00 PM - 06:00 PM"],
      tuesday: ["10:00 AM - 02:00 PM", "03:00 PM - 06:00 PM"],
      wednesday: ["10:00 AM - 02:00 PM"],
      thursday: ["10:00 AM - 02:00 PM", "03:00 PM - 06:00 PM"],
      friday: ["10:00 AM - 02:00 PM", "03:00 PM - 06:00 PM"],
      saturday: ["11:00 AM - 03:00 PM"],
      sunday: []
    },
    patients: 192,
    rating: 4.7,
    avatar: null,
    bio: "Dr. Sophia Miller is a skilled dermatologist with a focus on cosmetic dermatology and skin cancer detection. She combines clinical expertise with aesthetic sensibility to help patients achieve healthy, beautiful skin.",
    status: "active"
  },
  {
    id: 7,
    name: "Dr. David Clark",
    specialty: "Psychiatry",
    qualification: "MD",
    experience: 11,
    email: "david.clark@medportal.com",
    phone: "+1 (555) 789-0123",
    availability: {
      monday: ["09:00 AM - 01:00 PM", "02:00 PM - 05:00 PM"],
      tuesday: ["09:00 AM - 01:00 PM", "02:00 PM - 05:00 PM"],
      wednesday: ["09:00 AM - 01:00 PM"],
      thursday: ["09:00 AM - 01:00 PM", "02:00 PM - 05:00 PM"],
      friday: ["09:00 AM - 01:00 PM", "02:00 PM - 05:00 PM"],
      saturday: [],
      sunday: []
    },
    patients: 145,
    rating: 4.8,
    avatar: null,
    bio: "Dr. David Clark is a compassionate psychiatrist who specializes in mood disorders and anxiety. He employs evidence-based treatments and a warm, empathetic approach to help patients improve their mental health.",
    status: "active"
  }
];

// Specialties
export const specialties = [
  "General Medicine",
  "Cardiology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "Dermatology",
  "Psychiatry",
  "Gynecology",
  "Ophthalmology",
  "Urology",
  "ENT"
];

// Status options
export const statusOptions = [
  { value: "active", label: "Active", color: "green" },
  { value: "on_leave", label: "On Leave", color: "orange" },
  { value: "not_available", label: "Not Available", color: "red" }
];

export default doctorsData; 