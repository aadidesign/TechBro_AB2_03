import axios from 'axios';

const API_URL = 'http://localhost:3000/api/appointments';

export const appointmentService = {
  // Get all appointments
  getAllAppointments: async (filters = {}) => {
    try {
      const response = await axios.get(API_URL, { params: filters });
      return response.data;
    } catch (error) {
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

  // Create new appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(API_URL, appointmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, appointmentData);
      return response.data;
    } catch (error) {
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