import axios from 'axios';

// Update this URL to match your backend server
const API_URL = 'http://localhost:3000/api/appointments';

// Add this to handle CORS issues
axios.defaults.withCredentials = true;

// Add this function to check if the backend server is running
const checkServerConnection = async () => {
  try {
    await axios.get('http://localhost:3000/api/health');
    return true;
  } catch (error) {
    console.error('Backend server connection error:', error);
    return false;
  }
};

export const appointmentService = {
  // Get all appointments
  getAllAppointments: async (filters = {}) => {
    try {
      const isServerConnected = await checkServerConnection();
      if (!isServerConnected) {
        throw new Error('Backend server is not running or not accessible');
      }
      
      const response = await axios.get(API_URL, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  // Get upcoming appointments
  getUpcomingAppointments: async () => {
    try {
      const response = await axios.get(`${API_URL}/upcoming`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get appointments by date range
  getAppointmentsByDateRange: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/range`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new appointment
  createAppointment: async (appointmentData) => {
    try {
      console.log('Creating appointment with data:', appointmentData);
      
      // Convert patientId to ObjectId format if it's not already
      if (appointmentData.patientId && typeof appointmentData.patientId === 'string') {
        // If we don't have a valid ObjectId, we'll use a placeholder
        // In a real app, you would get this from your patient database
        appointmentData.patientId = '000000000000000000000000';
      }
      
      // Ensure duration is a number
      if (appointmentData.duration) {
        appointmentData.duration = Number(appointmentData.duration);
      }
      
      const response = await axios.post(API_URL, appointmentData);
      console.log('Create appointment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      console.log('Updating appointment with id:', id, 'and data:', appointmentData);
      
      // Ensure duration is a number
      if (appointmentData.duration) {
        appointmentData.duration = Number(appointmentData.duration);
      }
      
      const response = await axios.put(`${API_URL}/${id}`, appointmentData);
      console.log('Update appointment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Cancel appointment
  cancelAppointment: async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get available time slots
  getAvailableTimeSlots: async (date, doctorId) => {
    try {
      const response = await axios.get(`${API_URL}/available-slots/${date}/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 