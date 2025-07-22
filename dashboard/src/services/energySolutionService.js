import api from './api.js';

export const energySolutionService = {
  // Get all energy solutions with pagination
  getEnergySolutions: async (page = 1, limit = 10, search = '', sort = '') => {
    try {
      console.log(`Fetching energy solutions with page=${page}, limit=${limit}, search=${search}, sort=${sort}`);
      const response = await api.get('/energy-solutions', {
        params: { page, limit, search, sort }
      });
      console.log('Energy solutions API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // If response.data has the expected format with data array
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('Found solutions in response.data.data');
          return {
            success: true,
            data: response.data.data,
            totalPages: response.data.pagination?.totalPages || 1,
            currentPage: response.data.pagination?.page || page,
            total: response.data.total || response.data.data.length
          };
        }
        
        // If response.data is an array of solutions
        if (Array.isArray(response.data)) {
          console.log('Found solutions as array in response.data');
          return {
            success: true,
            data: response.data,
            totalPages: 1,
            currentPage: 1,
            total: response.data.length
          };
        }
        
        // If response.data has energySolutions property
        if (response.data.energySolutions && Array.isArray(response.data.energySolutions)) {
          console.log('Found solutions in response.data.energySolutions');
          return {
            success: true,
            data: response.data.energySolutions,
            totalPages: response.data.totalPages || 1,
            currentPage: response.data.currentPage || page,
            total: response.data.total || response.data.energySolutions.length
          };
        }
      }
      
      // If we couldn't parse the response in any expected format
      console.error('Unexpected solutions response format:', response);
      return {
        success: false,
        message: 'Failed to parse energy solutions data',
        data: [],
        totalPages: 1,
        currentPage: 1,
        total: 0
      };
    } catch (error) {
      console.error('Error fetching energy solutions:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch energy solutions',
        data: [],
        totalPages: 1,
        currentPage: 1,
        total: 0
      };
    }
  },
  
  // Get active energy solutions
  getActiveEnergySolutions: () => api.get('/energy-solutions/active'),
  
  // Get energy solution by ID
  getEnergySolutionById: (id) => api.get(`/energy-solutions/${id}`),
  
  // Create a new energy solution
  createEnergySolution: (data) => api.post('/energy-solutions', data),
  
  // Update an energy solution
  updateEnergySolution: (id, data) => api.put(`/energy-solutions/${id}`, data),
  
  // Delete an energy solution
  deleteEnergySolution: async (id) => {
    try {
      console.log(`Deleting energy solution with ID: ${id}`);
      const response = await api.delete(`/energy-solutions/${id}`);
      console.log('Delete energy solution API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // If response has success message directly
        if (response.data.success === true) {
          console.log('Solution deleted successfully');
          return {
            success: true,
            message: response.data.message || 'Energy solution deleted successfully'
          };
        }
        
        // If response has data property with success
        if (response.data.data && response.data.data.success === true) {
          console.log('Solution deleted successfully (nested data)');
          return {
            success: true,
            message: response.data.data.message || 'Energy solution deleted successfully'
          };
        }
      }
      
      // If we couldn't parse the response in any expected format
      console.error('Unexpected delete solution response format:', response);
      return {
        success: false,
        message: 'Failed to delete energy solution'
      };
    } catch (error) {
      console.error('Error deleting energy solution:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete energy solution'
      };
    }
  },
  
  // Reorder energy solutions
  reorderEnergySolutions: (data) => api.put('/energy-solutions/reorder', data)
};

export default energySolutionService;