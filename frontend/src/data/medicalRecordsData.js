// Mock data for Medical Records
const medicalRecordsData = [
  {
    id: 1,
    patientId: 1,
    patientName: "Emily Johnson",
    recordType: "Diagnosis",
    date: "2023-05-10",
    doctor: "Dr. Sarah Chen",
    title: "Annual Physical Examination",
    content: "Patient appears healthy. Blood pressure: 120/80 mmHg. Heart rate: 72 bpm. Weight: 65 kg. Height: 165 cm. No significant concerns reported. Recommended regular exercise and balanced diet.",
    attachments: [
      { id: 1, name: "Blood Work Results.pdf", type: "pdf", size: "1.2 MB" }
    ],
    status: "completed"
  },
  {
    id: 2,
    patientId: 2,
    patientName: "Michael Smith",
    recordType: "Prescription",
    date: "2023-05-12",
    doctor: "Dr. James Wilson",
    title: "Hypertension Treatment",
    content: "Prescribed Lisinopril 10mg daily for blood pressure management. Patient to monitor blood pressure daily and return for follow-up in 4 weeks. Advised on sodium restriction and regular exercise.",
    attachments: [],
    status: "active"
  },
  {
    id: 3,
    patientId: 3,
    patientName: "Sophia Williams",
    recordType: "Lab Results",
    date: "2023-05-15",
    doctor: "Dr. Mark Johnson",
    title: "Blood Work Analysis",
    content: "Complete Blood Count (CBC) within normal limits. Cholesterol slightly elevated at 210 mg/dL. Glucose: 95 mg/dL. Liver and kidney function tests normal. Recommended dietary changes to address cholesterol levels.",
    attachments: [
      { id: 2, name: "Lab Results.pdf", type: "pdf", size: "2.4 MB" },
      { id: 3, name: "Cholesterol Chart.jpg", type: "image", size: "0.8 MB" }
    ],
    status: "completed"
  },
  {
    id: 4,
    patientId: 4,
    patientName: "Daniel Brown",
    recordType: "Surgery",
    date: "2023-05-18",
    doctor: "Dr. Mark Johnson",
    title: "Appendectomy Report",
    content: "Patient underwent successful laparoscopic appendectomy for acute appendicitis. Procedure performed without complications. Post-operative recovery proceeding well. Pain well-controlled. Patient discharged with instructions for follow-up in 2 weeks.",
    attachments: [
      { id: 4, name: "Surgery Report.pdf", type: "pdf", size: "3.1 MB" },
      { id: 5, name: "Post-Op Instructions.pdf", type: "pdf", size: "0.5 MB" }
    ],
    status: "completed"
  },
  {
    id: 5,
    patientId: 5,
    patientName: "Olivia Davis",
    recordType: "Diagnosis",
    date: "2023-05-20",
    doctor: "Dr. Emily Roberts",
    title: "Respiratory Assessment",
    content: "Patient presents with persistent cough and shortness of breath for 10 days. Lung examination reveals wheezing. Suspected acute bronchitis. Chest X-ray ordered to rule out pneumonia. Prescribed bronchodilator and advised rest.",
    attachments: [
      { id: 6, name: "Chest X-ray.jpg", type: "image", size: "1.7 MB" }
    ],
    status: "pending"
  },
  {
    id: 6,
    patientId: 6,
    patientName: "James Miller",
    recordType: "Prescription",
    date: "2023-05-22",
    doctor: "Dr. Mark Johnson",
    title: "Pain Management",
    content: "Patient continuing to experience moderate lower back pain following injury. Prescribed Naproxen 500mg twice daily for 10 days. Referred to physical therapy twice weekly for 6 weeks. Advised on proper lifting techniques and ergonomic considerations.",
    attachments: [
      { id: 7, name: "Physical Therapy Referral.pdf", type: "pdf", size: "0.7 MB" }
    ],
    status: "active"
  },
  {
    id: 7,
    patientId: 7,
    patientName: "Ava Wilson",
    recordType: "Vaccination",
    date: "2023-05-25",
    doctor: "Dr. Sarah Chen",
    title: "Immunization Record",
    content: "Patient received influenza vaccine (standard dose, quadrivalent). No immediate adverse reactions. Patient advised on possible side effects and when to seek medical attention if necessary. Next vaccination due in 1 year.",
    attachments: [],
    status: "completed"
  },
  {
    id: 8,
    patientId: 8,
    patientName: "Ethan Moore",
    recordType: "Diagnosis",
    date: "2023-05-28",
    doctor: "Dr. Michael Thompson",
    title: "Neurological Evaluation",
    content: "Patient reports frequent headaches and occasional dizziness for past month. Neurological examination normal. No focal deficits. MRI of brain ordered to rule out structural abnormalities. Advised to maintain headache diary and return in 2 weeks.",
    attachments: [
      { id: 8, name: "MRI Report.pdf", type: "pdf", size: "2.2 MB" },
      { id: 9, name: "Brain MRI Images.zip", type: "zip", size: "15.8 MB" }
    ],
    status: "pending"
  },
  {
    id: 9,
    patientId: 9,
    patientName: "Alex Taylor",
    recordType: "Lab Results",
    date: "2023-05-30",
    doctor: "Dr. James Wilson",
    title: "Cardiac Enzyme Panel",
    content: "Troponin I: <0.01 ng/mL (normal). CK-MB: 3.2 ng/mL (normal). BNP: 42 pg/mL (normal). Results indicate no evidence of myocardial injury. Continue current medications and follow up as scheduled.",
    attachments: [
      { id: 10, name: "Cardiac Panel Results.pdf", type: "pdf", size: "1.5 MB" }
    ],
    status: "completed"
  }
];

// Record types
export const recordTypes = [
  "Diagnosis",
  "Prescription",
  "Lab Results",
  "Surgery",
  "Vaccination",
  "Imaging",
  "Consultation",
  "Follow-up"
];

// Status options
export const statusOptions = [
  { value: "active", label: "Active", color: "blue" },
  { value: "completed", label: "Completed", color: "green" },
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "cancelled", label: "Cancelled", color: "red" }
];

// File types
export const fileTypes = [
  { extension: "pdf", icon: "document" },
  { extension: "jpg", icon: "image" },
  { extension: "png", icon: "image" },
  { extension: "docx", icon: "document" },
  { extension: "xlsx", icon: "spreadsheet" },
  { extension: "zip", icon: "archive" }
];

export default medicalRecordsData; 