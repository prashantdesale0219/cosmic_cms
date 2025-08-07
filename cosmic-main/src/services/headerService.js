// src/services/headerService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const headerService = {
  // Get header data for frontend
  getHeaderData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/frontend/header`);
      return response.data;
    } catch (error) {
      console.error('Error fetching header data:', error);
      throw error;
    }
  }
};

export default headerService;