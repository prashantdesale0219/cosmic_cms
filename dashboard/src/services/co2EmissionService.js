import api from './api.js';

export const co2EmissionService = {
  // Get all CO2 emission reductions with pagination
  getCO2Emissions: async (page = 1, limit = 10, search = '', sort = '') => {
    try {
      console.log(`Fetching CO2 emissions with page=${page}, limit=${limit}, search=${search}, sort=${sort}`);
      const response = await api.get('/co2-emissions', {
        params: { page, limit, search, sort }
      });
      console.log('CO2 emissions API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // If response.data has the expected format with emissions array
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('Found emissions in response.data.data');
          return {
            success: true,
            data: response.data.data,
            totalPages: response.data.pagination?.totalPages || 1,
            currentPage: response.data.pagination?.page || page,
            total: response.data.total || response.data.data.length
          };
        }
        
        // If response.data is an array of emissions
        if (Array.isArray(response.data)) {
          console.log('Found emissions as array in response.data');
          return {
            success: true,
            data: response.data,
            totalPages: 1,
            currentPage: 1,
            total: response.data.length
          };
        }
        
        // If response.data has emissions property
        if (response.data.emissions && Array.isArray(response.data.emissions)) {
          console.log('Found emissions in response.data.emissions');
          return {
            success: true,
            data: response.data.emissions,
            totalPages: response.data.totalPages || 1,
            currentPage: response.data.currentPage || page,
            total: response.data.total || response.data.emissions.length
          };
        }
      }
      
      // If we couldn't parse the response in any expected format
      console.error('Unexpected emissions response format:', response);
      return {
        success: false,
        message: 'Failed to parse emissions data',
        data: [],
        totalPages: 1,
        currentPage: 1,
        total: 0
      };
    } catch (error) {
      console.error('Error fetching CO2 emissions:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch CO2 emissions',
        data: [],
        totalPages: 1,
        currentPage: 1,
        total: 0
      };
    }
  },
  
  // Get active CO2 emission reductions
  getActiveCO2Emissions: () => api.get('/co2-emissions/active'),
  
  // Get CO2 emission reduction by ID
  getCO2EmissionById: (id) => api.get(`/co2-emissions/${id}`),
  
  // Create a new CO2 emission reduction
  createCO2Emission: (data) => api.post('/co2-emissions', data),
  
  // Update a CO2 emission reduction
  updateCO2Emission: (id, data) => api.put(`/co2-emissions/${id}`, data),
  
  // Delete a CO2 emission reduction
  deleteCO2Emission: async (id) => {
    try {
      console.log(`Deleting CO2 emission with ID: ${id}`);
      const response = await api.delete(`/co2-emissions/${id}`);
      console.log('Delete CO2 emission API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // If response has success message directly
        if (response.data.success === true) {
          console.log('Emission deleted successfully');
          return {
            success: true,
            message: response.data.message || 'CO2 emission deleted successfully'
          };
        }
        
        // If response has data property with success
        if (response.data.data && response.data.data.success === true) {
          console.log('Emission deleted successfully (nested data)');
          return {
            success: true,
            message: response.data.data.message || 'CO2 emission deleted successfully'
          };
        }
      }
      
      // If we couldn't parse the response in any expected format
      console.error('Unexpected delete emission response format:', response);
      return {
        success: false,
        message: 'Failed to delete CO2 emission'
      };
    } catch (error) {
      console.error('Error deleting CO2 emission:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete CO2 emission'
      };
    }
  },
  
  // Reorder CO2 emission reductions
  reorderCO2Emissions: (data) => api.put('/co2-emissions/reorder', data)
};

export default co2EmissionService;