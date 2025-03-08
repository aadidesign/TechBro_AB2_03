import axios from 'axios';

const API_URL = '/api/medical-records';

const medicalRecordService = {
    // Get all medical records with pagination and filters
    getAllRecords: async (page = 1, limit = 10, search = '', type = '', status = '') => {
        try {
            const response = await axios.get(
                `${API_URL}?page=${page}&limit=${limit}&search=${search}&type=${type}&status=${status}`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get medical record by ID
    getRecordById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get medical records for a specific patient
    getPatientRecords: async (patientId) => {
        try {
            const response = await axios.get(`${API_URL}/patient/${patientId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new medical record
    createRecord: async (recordData) => {
        try {
            const response = await axios.post(API_URL, recordData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update medical record
    updateRecord: async (id, recordData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, recordData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete medical record
    deleteRecord: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Search medical records
    searchRecords: async (query = '', type = '', status = '') => {
        try {
            const response = await axios.get(
                `${API_URL}/search?query=${query}&type=${type}&status=${status}`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default medicalRecordService; 