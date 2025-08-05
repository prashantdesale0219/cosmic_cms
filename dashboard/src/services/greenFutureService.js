import api from './api';

// Get active Green Future data
export const getGreenFuture = async () => {
  try {
    const response = await api.get('/green-future');
    const data = response.data;
    
    // Ensure newsCards is always an array
    if (!data.newsCards) {
      console.log('API response: newsCards is undefined, setting to empty array');
      data.newsCards = [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Green Future data:', error);
    throw error;
  }
};

// Create or update Green Future data
export const createOrUpdateGreenFuture = async (greenFutureData, token) => {
  try {
    const response = await api.post('/green-future', greenFutureData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating/updating Green Future data:', error);
    throw error;
  }
};

// Add a news card
export const addNewsCard = async (newsCardData, token) => {
  try {
    console.log('Frontend Service - Adding news card:', newsCardData);
    console.log('Frontend Service - Token:', token ? 'Present' : 'Missing');
    const response = await api.post('/green-future/news-cards', newsCardData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Frontend Service - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Frontend Service - Error adding news card:', error);
    console.error('Frontend Service - Error response:', error.response?.data);
    throw error;
  }
};

// Update a news card
export const updateNewsCard = async (id, newsCardData, token) => {
  try {
    const response = await api.put(`/green-future/news-cards/${id}`, newsCardData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating news card:', error);
    throw error;
  }
};

// Delete a news card
export const deleteNewsCard = async (id, token) => {
  try {
    const response = await api.delete(`/green-future/news-cards/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting news card:', error);
    throw error;
  }
};