// Mock data for Reports
const reportsData = [
  {
    id: 1,
    title: "Monthly Patient Admissions",
    type: "line",
    description: "Number of patients admitted per month over the past year",
    date: "2023-05-31",
    status: "completed",
    data: {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [
        { 
          label: "Admissions", 
          data: [65, 72, 78, 75, 82, 88, 95, 85, 78, 84, 90, 96],
          borderColor: "#3b82f6"
        }
      ]
    }
  },
  {
    id: 2,
    title: "Department Revenue Breakdown",
    type: "pie",
    description: "Revenue percentage by medical department for current quarter",
    date: "2023-05-28",
    status: "completed",
    data: {
      labels: ["Cardiology", "Orthopedics", "Pediatrics", "Neurology", "General Medicine", "Other"],
      datasets: [
        {
          data: [25, 20, 15, 12, 18, 10],
          backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"]
        }
      ]
    }
  },
  {
    id: 3,
    title: "Appointment Statistics",
    type: "bar",
    description: "Appointment counts by type and status for the current month",
    date: "2023-05-25",
    status: "completed",
    data: {
      labels: ["Consultation", "Follow-up", "Check-up", "Emergency", "Other"],
      datasets: [
        {
          label: "Completed",
          data: [42, 35, 28, 15, 12],
          backgroundColor: "#10b981"
        },
        {
          label: "Cancelled",
          data: [8, 5, 4, 3, 2],
          backgroundColor: "#ef4444"
        },
        {
          label: "Pending",
          data: [12, 10, 8, 5, 3],
          backgroundColor: "#f59e0b"
        }
      ]
    }
  },
  {
    id: 4,
    title: "Patient Demographics",
    type: "donut",
    description: "Age distribution of patients in the hospital database",
    date: "2023-05-20",
    status: "completed",
    data: {
      labels: ["0-18", "19-35", "36-50", "51-65", "65+"],
      datasets: [
        {
          data: [15, 25, 30, 20, 10],
          backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
        }
      ]
    }
  },
  {
    id: 5,
    title: "Doctor Performance Metrics",
    type: "radar",
    description: "Performance evaluation metrics for top doctors",
    date: "2023-05-15",
    status: "completed",
    data: {
      labels: ["Patient Satisfaction", "Timeliness", "Documentation", "Diagnoses Accuracy", "Follow-up Care"],
      datasets: [
        {
          label: "Dr. Sarah Chen",
          data: [95, 85, 90, 92, 88],
          borderColor: "#3b82f6"
        },
        {
          label: "Dr. James Wilson",
          data: [90, 92, 85, 95, 90],
          borderColor: "#10b981"
        },
        {
          label: "Dr. Mark Johnson",
          data: [88, 90, 92, 85, 94],
          borderColor: "#f59e0b"
        }
      ]
    }
  },
  {
    id: 6,
    title: "Medical Records Growth",
    type: "line",
    description: "Growth of electronic medical records over time",
    date: "2023-05-10",
    status: "completed",
    data: {
      labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
      datasets: [
        {
          label: "Total Records",
          data: [1250, 1850, 2750, 4250, 6500, 8750],
          borderColor: "#8b5cf6"
        },
        {
          label: "Digital Conversion Rate",
          data: [25, 45, 65, 78, 92, 98],
          borderColor: "#10b981"
        }
      ]
    }
  },
  {
    id: 7,
    title: "Staff Workload Analysis",
    type: "bar",
    description: "Average weekly hours by department and role",
    date: "2023-05-05",
    status: "pending",
    data: {
      labels: ["Doctors", "Nurses", "Technicians", "Administrative"],
      datasets: [
        {
          label: "General Medicine",
          data: [48, 42, 38, 40],
          backgroundColor: "#3b82f6"
        },
        {
          label: "Emergency",
          data: [52, 48, 42, 38],
          backgroundColor: "#ef4444"
        },
        {
          label: "Surgery",
          data: [50, 45, 40, 38],
          backgroundColor: "#f59e0b"
        }
      ]
    }
  },
  {
    id: 8,
    title: "Insurance Claims Analysis",
    type: "line",
    description: "Monthly insurance claims processing efficiency",
    date: "2023-05-02",
    status: "completed",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [
        {
          label: "Claims Submitted",
          data: [320, 350, 380, 410, 430],
          borderColor: "#3b82f6"
        },
        {
          label: "Claims Processed",
          data: [290, 330, 365, 395, 418],
          borderColor: "#10b981"
        },
        {
          label: "Processing Time (days)",
          data: [12, 10, 8, 7, 6],
          borderColor: "#f59e0b"
        }
      ]
    }
  },
  {
    id: 9,
    title: "Patient Satisfaction Survey",
    type: "bar",
    description: "Quarterly satisfaction scores across departments",
    date: "2023-04-28",
    status: "completed",
    data: {
      labels: ["Q2 2022", "Q3 2022", "Q4 2022", "Q1 2023", "Q2 2023"],
      datasets: [
        {
          label: "Overall",
          data: [8.2, 8.4, 8.5, 8.7, 8.9],
          backgroundColor: "#3b82f6"
        },
        {
          label: "Doctor Care",
          data: [8.5, 8.6, 8.7, 8.9, 9.1],
          backgroundColor: "#10b981"
        },
        {
          label: "Facility",
          data: [7.8, 8.0, 8.2, 8.4, 8.6],
          backgroundColor: "#f59e0b"
        },
        {
          label: "Staff",
          data: [8.3, 8.5, 8.6, 8.8, 9.0],
          backgroundColor: "#8b5cf6"
        }
      ]
    }
  }
];

// Report types
export const reportTypes = [
  { value: 'line', label: 'Line Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'donut', label: 'Donut Chart' },
  { value: 'radar', label: 'Radar Chart' }
];

// Report categories
export const reportCategories = [
  { value: 'patient', label: 'Patient Statistics' },
  { value: 'appointment', label: 'Appointment Analytics' },
  { value: 'revenue', label: 'Revenue Analysis' },
  { value: 'treatment', label: 'Treatment Outcomes' },
  { value: 'inventory', label: 'Inventory Management' }
];

// Status options
export const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'yellow' },
  { value: 'published', label: 'Published', color: 'green' },
  { value: 'archived', label: 'Archived', color: 'gray' }
];

const generateMockChartData = (type) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  switch (type) {
    case 'line':
      return {
        labels: months,
        datasets: [
          {
            label: 'Patients',
            data: months.map(() => Math.floor(Math.random() * 100)),
            borderColor: '#3b82f6',
            tension: 0.4
          },
          {
            label: 'Appointments',
            data: months.map(() => Math.floor(Math.random() * 100)),
            borderColor: '#10b981',
            tension: 0.4
          }
        ]
      };
    
    case 'bar':
      return {
        labels: months,
        datasets: [
          {
            label: 'Revenue',
            data: months.map(() => Math.floor(Math.random() * 100)),
            backgroundColor: '#3b82f6'
          },
          {
            label: 'Expenses',
            data: months.map(() => Math.floor(Math.random() * 100)),
            backgroundColor: '#ef4444'
          }
        ]
      };
    
    case 'pie':
    case 'donut':
      return {
        labels: ['Completed', 'Pending', 'Cancelled'],
        datasets: [{
          data: [65, 25, 10],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
        }]
      };
    
    case 'radar':
      return {
        labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
        datasets: [{
          label: 'Current',
          data: [85, 75, 90, 80, 85],
          borderColor: '#3b82f6'
        }, {
          label: 'Target',
          data: [90, 85, 95, 90, 90],
          borderColor: '#10b981'
        }]
      };
    
    default:
      return {
        labels: months,
        datasets: [{
          data: months.map(() => Math.floor(Math.random() * 100)),
          borderColor: '#3b82f6'
        }]
      };
  }
};

export default [
  {
    id: 1,
    title: 'Monthly Patient Statistics',
    description: 'Analysis of patient visits and treatment outcomes over the past 6 months',
    type: 'line',
    category: 'patient',
    status: 'published',
    date: '2024-03-10',
    data: generateMockChartData('line')
  },
  {
    id: 2,
    title: 'Revenue Analysis Q1 2024',
    description: 'Detailed breakdown of revenue streams and financial performance',
    type: 'bar',
    category: 'revenue',
    status: 'published',
    date: '2024-03-08',
    data: generateMockChartData('bar')
  },
  {
    id: 3,
    title: 'Appointment Distribution',
    description: 'Overview of appointment status and scheduling patterns',
    type: 'pie',
    category: 'appointment',
    status: 'published',
    date: '2024-03-07',
    data: generateMockChartData('pie')
  },
  {
    id: 4,
    title: 'Treatment Success Metrics',
    description: 'Analysis of treatment outcomes and success rates across different departments',
    type: 'radar',
    category: 'treatment',
    status: 'draft',
    date: '2024-03-06',
    data: generateMockChartData('radar')
  },
  {
    id: 5,
    title: 'Inventory Status Report',
    description: 'Current status of medical supplies and equipment inventory',
    type: 'donut',
    category: 'inventory',
    status: 'published',
    date: '2024-03-05',
    data: generateMockChartData('donut')
  },
  {
    id: 6,
    title: 'Patient Satisfaction Trends',
    description: 'Analysis of patient feedback and satisfaction scores over time',
    type: 'line',
    category: 'patient',
    status: 'draft',
    date: '2024-03-04',
    data: generateMockChartData('line')
  }
]; 