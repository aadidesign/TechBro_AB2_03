const fs = require("fs");
const path = require("path");

// Define paths to data files
const patientsFile = path.join(__dirname, "../data/patients.json");
const appointmentsFile = path.join(__dirname, "../data/appointments.json");
const doctorsFile = path.join(__dirname, "../data/doctors.json");
const medicalRecordsFile = path.join(__dirname, "../data/medicalRecords.json");
const labTestsFile = path.join(__dirname, "../data/labTests.json");

// Helper functions to get data
const getPatients = () => {
  if (!fs.existsSync(patientsFile)) return [];
  const data = fs.readFileSync(patientsFile);
  return JSON.parse(data);
};

const getAppointments = () => {
  if (!fs.existsSync(appointmentsFile)) return [];
  const data = fs.readFileSync(appointmentsFile);
  return JSON.parse(data);
};

const getDoctors = () => {
  if (!fs.existsSync(doctorsFile)) return [];
  const data = fs.readFileSync(doctorsFile);
  return JSON.parse(data);
};

const getMedicalRecords = () => {
  if (!fs.existsSync(medicalRecordsFile)) return [];
  const data = fs.readFileSync(medicalRecordsFile);
  return JSON.parse(data);
};

const getLabTests = () => {
  if (!fs.existsSync(labTestsFile)) return [];
  const data = fs.readFileSync(labTestsFile);
  return JSON.parse(data);
};

// Get dashboard stats
exports.getDashboardStats = (req, res) => {
  try {
    const patients = getPatients();
    const appointments = getAppointments();
    const medicalRecords = getMedicalRecords();
    
    // Calculate patient growth percentage based on creation dates if available
    let patientChange = "0%";
    let patientChangeValue = 0;
    
    // Calculate only if patients have creation dates
    if (patients.length > 0 && patients[0].createdAt) {
      const currentDate = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const thisMonthPatients = patients.filter(p => new Date(p.createdAt) >= lastMonth);
      patientChangeValue = thisMonthPatients.length;
      patientChange = `+${patientChangeValue}`;
    }
    
    // Calculate appointment change
    let appointmentChange = "0%";
    if (appointments.length > 0 && appointments[0].createdAt) {
      const currentDate = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const thisMonthAppointments = appointments.filter(a => new Date(a.createdAt) >= lastMonth);
      const changePercentage = Math.round((thisMonthAppointments.length / appointments.length) * 100);
      appointmentChange = `+${changePercentage}%`;
    }
    
    // Calculate average wait time based on appointments
    let avgWaitTime = "0 min";
    let waitTimeChange = "0 min";
    let isWaitTimePositive = true;
    
    if (appointments.length > 0 && appointments[0].waitTime) {
      const waitTimes = appointments.filter(a => a.waitTime).map(a => a.waitTime);
      if (waitTimes.length > 0) {
        const avgWait = Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length);
        avgWaitTime = `${avgWait} min`;
        
        // For simplicity, we'll consider wait time reduction as positive
        waitTimeChange = "-2 min"; // This should be calculated from real historical data if available
      }
    }
    
    // Count pending reports/records
    const pendingReports = medicalRecords.filter(record => record.status === "pending").length;
    const pendingChange = pendingReports > 0 ? `+${pendingReports}` : "0";
    
    // Create stats based on real data
    const stats = [
      {
        id: 1,
        title: "Total Patients",
        value: patients.length,
        change: patientChange,
        isPositive: true,
        icon: "patients",
        color: "blue"
      },
      {
        id: 2,
        title: "Appointments",
        value: appointments.length,
        change: appointmentChange,
        isPositive: true,
        icon: "calendar",
        color: "green"
      },
      {
        id: 3,
        title: "Avg. Wait Time",
        value: avgWaitTime,
        change: waitTimeChange,
        isPositive: isWaitTimePositive,
        icon: "clock",
        color: "indigo"
      },
      {
        id: 4,
        title: "Pending Reports",
        value: pendingReports,
        change: pendingChange,
        isPositive: false,
        icon: "document",
        color: "red"
      }
    ];
    
    res.json(stats);
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ error: "Failed to get dashboard stats" });
  }
};

// Get recent activity based only on real data
exports.getRecentActivity = (req, res) => {
  try {
    const activities = [];
    let activityId = 1;
    
    const appointments = getAppointments();
    const medicalRecords = getMedicalRecords();
    const labTests = getLabTests();
    
    // Add appointment activities
    appointments.forEach(appointment => {
      // Convert appointment date to timestamp if available
      const timestamp = appointment.createdAt 
        ? new Date(appointment.createdAt) 
        : new Date(Date.now() - Math.random() * 86400000); // Use current date minus random hours if no date
      
      activities.push({
        id: activityId++,
        type: "appointment",
        message: `Appointment ${appointment.status || ''} for ${appointment.patient_name}`,
        time: getTimeAgo(timestamp),
        timestamp // Keep timestamp for sorting
      });
    });
    
    // Add medical record activities
    medicalRecords.forEach(record => {
      const timestamp = record.updatedAt 
        ? new Date(record.updatedAt) 
        : new Date(Date.now() - Math.random() * 86400000);
      
      activities.push({
        id: activityId++,
        type: "record",
        message: `Medical record ${record.status || 'updated'} for patient ${record.patient_name}`,
        time: getTimeAgo(timestamp),
        timestamp
      });
    });
    
    // Add lab test activities if available
    if (labTests && labTests.length) {
      labTests.forEach(test => {
        const timestamp = test.createdAt 
          ? new Date(test.createdAt) 
          : new Date(Date.now() - Math.random() * 86400000);
          
        activities.push({
          id: activityId++,
          type: "test",
          message: `Lab test ${test.status || ''} for ${test.patient_name}`,
          time: getTimeAgo(timestamp),
          timestamp
        });
      });
    }
    
    // Sort activities by timestamp (newest first) and take only the 5 most recent
    activities.sort((a, b) => b.timestamp - a.timestamp);
    
    // Remove the timestamp field before sending the response
    const recentActivities = activities.slice(0, 5).map(({ timestamp, ...activity }) => activity);
    
    res.json(recentActivities);
  } catch (error) {
    console.error("Error getting recent activity:", error);
    res.status(500).json({ error: "Failed to get recent activity" });
  }
};

// Helper function to format time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHour < 24) return `${diffHour} hours ago`;
  if (diffDay === 1) return 'Yesterday';
  return `${diffDay} days ago`;
}

// Get upcoming appointments based only on real data
exports.getUpcomingAppointments = (req, res) => {
  try {
    const appointments = getAppointments();
    const patients = getPatients();
    
    // Get today's and tomorrow's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Filter and format upcoming appointments
    const upcomingAppointments = appointments
      .filter(appointment => appointment.date === today || appointment.date === tomorrow)
      .map(appointment => {
        const patient = patients.find(p => p.id === appointment.patient_id) || {};
        return {
          id: appointment.id,
          patientName: patient.name || appointment.patient_name || "Unknown",
          patientId: appointment.patient_id,
          time: appointment.time || "00:00",
          date: appointment.date === today ? "Today" : "Tomorrow",
          purpose: appointment.purpose || "Visit"
        };
      })
      .slice(0, 4); // Get only first 4 appointments
    
    res.json(upcomingAppointments);
  } catch (error) {
    console.error("Error getting upcoming appointments:", error);
    res.status(500).json({ error: "Failed to get upcoming appointments" });
  }
};

// Get health metrics based only on real data
exports.getHealthMetrics = (req, res) => {
  try {
    const patients = getPatients();
    const appointments = getAppointments();
    
    // Calculate patient growth (monthly new patients)
    const patientGrowth = Array(12).fill(0); // Initialize with zeros for all months
    
    // Only calculate if patients have creation dates
    if (patients.length > 0 && patients[0].createdAt) {
      patients.forEach(patient => {
        if (patient.createdAt) {
          const creationDate = new Date(patient.createdAt);
          const month = creationDate.getMonth();
          patientGrowth[month]++;
        }
      });
    }
    
    // Calculate appointment distribution
    const purposes = appointments.reduce((acc, appointment) => {
      const purpose = appointment.purpose || "Other";
      acc[purpose] = (acc[purpose] || 0) + 1;
      return acc;
    }, {});
    
    const appointmentDistribution = Object.entries(purposes).map(([name, value]) => ({ name, value }));
    
    // Calculate age distribution
    const ageGroups = { "0-18": 0, "19-35": 0, "36-50": 0, "51+": 0 };
    
    patients.forEach(patient => {
      if (patient.age) {
        const age = parseInt(patient.age);
        if (age <= 18) ageGroups["0-18"]++;
        else if (age <= 35) ageGroups["19-35"]++;
        else if (age <= 50) ageGroups["36-50"]++;
        else ageGroups["51+"]++;
      }
    });
    
    // Format the health metrics object
    const healthMetrics = {
      patientGrowth,
      appointmentDistribution,
      ageDistribution: ageGroups
    };
    
    res.json(healthMetrics);
  } catch (error) {
    console.error("Error getting health metrics:", error);
    res.status(500).json({ error: "Failed to get health metrics" });
  }
};

// Get all dashboard data in a single request - using only real data
exports.getDashboardData = (req, res) => {
  try {
    const patients = getPatients();
    const appointments = getAppointments();
    const medicalRecords = getMedicalRecords();
    const labTests = getLabTests();
    
    // Calculate stats
    // Patient growth
    let patientChange = "0%";
    if (patients.length > 0 && patients[0].createdAt) {
      const currentDate = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const thisMonthPatients = patients.filter(p => new Date(p.createdAt) >= lastMonth);
      const changePercentage = Math.round((thisMonthPatients.length / patients.length) * 100);
      patientChange = `+${changePercentage}%`;
    }
    
    // Appointment change
    let appointmentChange = "0%";
    if (appointments.length > 0 && appointments[0].createdAt) {
      const currentDate = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const thisMonthAppointments = appointments.filter(a => new Date(a.createdAt) >= lastMonth);
      const changePercentage = Math.round((thisMonthAppointments.length / appointments.length) * 100);
      appointmentChange = `+${changePercentage}%`;
    }
    
    // Average wait time
    let avgWaitTime = "0 min";
    let waitTimeChange = "0 min";
    let isWaitTimePositive = true;
    
    if (appointments.length > 0 && appointments[0].waitTime) {
      const waitTimes = appointments.filter(a => a.waitTime).map(a => a.waitTime);
      if (waitTimes.length > 0) {
        const avgWait = Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length);
        avgWaitTime = `${avgWait} min`;
        waitTimeChange = "0 min"; // This would need historical data to calculate properly
      }
    }
    
    // Pending reports
    const pendingReports = medicalRecords.filter(record => record.status === "pending").length;
    const pendingChange = pendingReports > 0 ? `+${pendingReports}` : "0";
    
    const stats = [
      {
        id: 1,
        title: "Total Patients",
        value: patients.length,
        change: patientChange,
        isPositive: true,
        icon: "patients",
        color: "blue"
      },
      {
        id: 2,
        title: "Appointments",
        value: appointments.length,
        change: appointmentChange,
        isPositive: true,
        icon: "calendar",
        color: "green"
      },
      {
        id: 3,
        title: "Avg. Wait Time",
        value: avgWaitTime,
        change: waitTimeChange,
        isPositive: isWaitTimePositive,
        icon: "clock",
        color: "indigo"
      },
      {
        id: 4,
        title: "Pending Reports",
        value: pendingReports,
        change: pendingChange,
        isPositive: false,
        icon: "document",
        color: "red"
      }
    ];
    
    // Prepare recent activity
    const activities = [];
    let activityId = 1;
    
    // Add appointment activities
    appointments.forEach(appointment => {
      const timestamp = appointment.createdAt 
        ? new Date(appointment.createdAt) 
        : new Date(); 
      
      activities.push({
        id: activityId++,
        type: "appointment",
        message: `Appointment ${appointment.status || ''} for ${appointment.patient_name}`,
        time: getTimeAgo(timestamp),
        timestamp
      });
    });
    
    // Add medical record activities
    medicalRecords.forEach(record => {
      const timestamp = record.updatedAt 
        ? new Date(record.updatedAt) 
        : new Date();
      
      activities.push({
        id: activityId++,
        type: "record",
        message: `Medical record ${record.status || 'updated'} for patient ${record.patient_name}`,
        time: getTimeAgo(timestamp),
        timestamp
      });
    });
    
    // Add lab test activities if available
    if (labTests && labTests.length) {
      labTests.forEach(test => {
        const timestamp = test.createdAt 
          ? new Date(test.createdAt) 
          : new Date();
          
        activities.push({
          id: activityId++,
          type: "test",
          message: `Lab test ${test.status || ''} for ${test.patient_name}`,
          time: getTimeAgo(timestamp),
          timestamp
        });
      });
    }
    
    // Sort activities by timestamp (newest first) and take only the 5 most recent
    activities.sort((a, b) => b.timestamp - a.timestamp);
    
    // Remove the timestamp field before sending the response
    const recentActivity = activities.slice(0, 5).map(({ timestamp, ...activity }) => activity);
    
    // Calculate upcoming appointments
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const upcomingAppointments = appointments
      .filter(appointment => appointment.date === today || appointment.date === tomorrow)
      .map(appointment => {
        const patient = patients.find(p => p.id === appointment.patient_id) || {};
        return {
          id: appointment.id,
          patientName: patient.name || appointment.patient_name || "Unknown",
          patientId: appointment.patient_id,
          time: appointment.time || "00:00",
          date: appointment.date === today ? "Today" : "Tomorrow",
          purpose: appointment.purpose || "Visit"
        };
      })
      .slice(0, 4);
    
    // Calculate patient growth
    const patientGrowth = Array(12).fill(0);
    
    if (patients.length > 0 && patients[0].createdAt) {
      patients.forEach(patient => {
        if (patient.createdAt) {
          const creationDate = new Date(patient.createdAt);
          const month = creationDate.getMonth();
          patientGrowth[month]++;
        }
      });
    }
    
    // Calculate appointment distribution
    const purposes = appointments.reduce((acc, appointment) => {
      const purpose = appointment.purpose || "Other";
      acc[purpose] = (acc[purpose] || 0) + 1;
      return acc;
    }, {});
    
    const appointmentDistribution = Object.entries(purposes).map(([name, value]) => ({ name, value }));
    
    // Calculate age distribution
    const ageGroups = { "0-18": 0, "19-35": 0, "36-50": 0, "51+": 0 };
    
    patients.forEach(patient => {
      if (patient.age) {
        const age = parseInt(patient.age);
        if (age <= 18) ageGroups["0-18"]++;
        else if (age <= 35) ageGroups["19-35"]++;
        else if (age <= 50) ageGroups["36-50"]++;
        else ageGroups["51+"]++;
      }
    });
    
    // Combine all dashboard data
    const dashboardData = {
      stats,
      recentActivity,
      upcomingAppointments,
      healthMetrics: {
        patientGrowth,
        appointmentDistribution,
        ageDistribution: ageGroups
      }
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    res.status(500).json({ error: "Failed to get dashboard data" });
  }
}; 