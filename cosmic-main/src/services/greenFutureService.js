import axios from 'axios';

// Create axios instance with base URL
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get active Green Future data
export const getGreenFuture = async () => {
  try {
    console.log('Frontend Service - Fetching Green Future data...');
    const response = await api.get('/green-future');
    const data = response.data;
    
    // Ensure newsCards is always an array
    if (!data.newsCards) {
      console.log('Frontend Service - newsCards is undefined, setting to empty array');
      data.newsCards = [];
    }
    
    console.log('Frontend Service - Green Future data fetched:', data);
    console.log('Frontend Service - News Cards count:', data.newsCards.length);
    return data;
  } catch (error) {
    console.error('Frontend Service - Error fetching Green Future data:', error);
    throw error;
  }
};

export default {
  getGreenFuture
};