import api from './api.js';

export const solarSolutionService = {
  // Get all solar solutions with pagination
  getSolarSolutions: async (page = 1, limit = 10, search = '', sort = '') => {
    try {
      console.log(`Fetching solar solutions with page=${page}, limit=${limit}, search=${search}, sort=${sort}`);
      const response = await api.get('/solar-solutions', {
        params: { page, limit, search, sort }
      });
      console.log('Solar solutions API response:', response);
      
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
        
        // If response.data has solarSolutions property
        if (response.data.solarSolutions && Array.isArray(response.data.solarSolutions)) {
          console.log('Found solutions in response.data.solarSolutions');
          return {
            success: true,
            data: response.data.solarSolutions,
            totalPages: response.data.totalPages || 1,
            currentPage: response.data.currentPage || page,
            total: response.data.total || response.data.solarSolutions.length
          };
        }
      }
      
      // If we couldn't parse the response in any expected format
      console.error('Unexpected solutions response format:', response);
      return {
        success: false,
        message: 'Failed to parse solar solutions data',
        data: [],
        totalPages: 1,
        currentPage: 1,
        total: 0
      };
    } catch (error) {
      console.error('Error fetching solar solutions:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch solar solutions',
        data: [],
        totalPages: 1,
        currentPage: 1,
        total: 0
      };
    }
  },
  
  // Get active solar solutions
  getActiveSolarSolutions: () => api.get('/solar-solutions/active'),
  
  // Get featured solar solutions
  getFeaturedSolarSolutions: () => api.get('/solar-solutions/featured'),
  
  // Get solar solution by ID
  getSolarSolutionById: (id) => api.get(`/solar-solutions/id/${id}`),
  
  // Get solar solution by slug
  getSolarSolutionBySlug: (slug) => api.get(`/solar-solutions/slug/${slug}`),
  
  // Create a new solar solution
  createSolarSolution: async (data) => {
    try {
      console.log('Creating solar solution with data:', data);
      const response = await api.post('/solar-solutions', data);
      console.log('Create solar solution API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // If response has success message directly
        if (response.data.success === true) {
          console.log('Solution created successfully');
          return {
            success: true,
            data: response.data.data || response.data,
            message: response.data.message || 'Solar solution created successfully'
          };
        }
        
        // If response has data property with success
        if (response.data.data && response.data.data.success === true) {
          console.log('Solution created successfully (nested data)');
          return {
            success: true,
            data: response.data.data.data || response.data.data,
            message: response.data.data.message || 'Solar solution created successfully'
          };
        }
        
        // If response has status 201/200, consider it successful
        if (response.status >= 200 && response.status < 300) {
          console.log('Solution created successfully (status code)');
          return {
            success: true,
            data: response.data,
            message: 'Solar solution created successfully'
          };
        }
      }
      
      // If we couldn't parse the response in any expected format
      console.error('Unexpected create solution response format:', response);
      return {
        success: false,
        message: 'Failed to create solar solution'
      };
    } catch (error) {
      console.error('Error creating solar solution:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create solar solution'
      };
    }
  },
  
  // Update a solar solution
  updateSolarSolution: async (id, data) => {
    try {
      console.log(`Updating solar solution ${id} with data:`, data);
      const response = await api.put(`/solar-solutions/${id}`, data);
      console.log('Update solar solution API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // If response has success message directly
        if (response.data.success === true) {
          console.log('Solution updated successfully');
          return {
            success: true,
            data: response.data.data || response.data,
            message: response.data.message || 'Solar solution updated successfully'
          };
        }
        
        // If response has data property with success
        if (response.data.data && response.data.data.success === true) {
          console.log('Solution updated successfully (nested data)');
          return {
            success: true,
            data: response.data.data.data || response.data.data,
            message: response.data.data.message || 'Solar solution updated successfully'
          };
        }
        
        // If response has status 200, consider it successful
        if (response.status >= 200 && response.status < 300) {
          console.log('Solution updated successfully (status code)');
          return {
            success: true,
            data: response.data,
            message: 'Solar solution updated successfully'
          };
        }
      }
      
      // If we couldn't parse the response in any expected format
      console.error('Unexpected update solution response format:', response);
      return {
        success: false,
        message: 'Failed to update solar solution'
      };
    } catch (error) {
      console.error('Error updating solar solution:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update solar solution'
      };
    }
  },
  
  // Delete a solar solution
  deleteSolarSolution: async (id) => {
    try {
      console.log(`Deleting solar solution with ID: ${id}`);
      const response = await api.delete(`/solar-solutions/${id}`);
      console.log('Delete solar solution API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // If response has success message directly
        if (response.data.success === true) {
          console.log('Solution deleted successfully');
          return {
            success: true,
            message: response.data.message || 'Solar solution deleted successfully'
          };
        }
        
        // If response has data property with success
        if (response.data.data && response.data.data.success === true) {
          console.log('Solution deleted successfully (nested data)');
          return {
            success: true,
            message: response.data.data.message || 'Solar solution deleted successfully'
          };
        }
      }
      
      // If we couldn't parse the response in any expected format
      console.error('Unexpected delete solution response format:', response);
      return {
        success: false,
        message: 'Failed to delete solar solution'
      };
    } catch (error) {
      console.error('Error deleting solar solution:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete solar solution'
      };
    }
  },
  
  // Reorder solar solutions
  reorderSolarSolutions: async (data) => {
    try {
      console.log('Reordering solar solutions with data:', data);
      const response = await api.put('/solar-solutions/reorder', data);
      console.log('Reorder solar solutions API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // If response has success message directly
        if (response.data.success === true) {
          console.log('Solutions reordered successfully');
          return {
            success: true,
            data: response.data.data || response.data,
            message: response.data.message || 'Solar solutions reordered successfully'
          };
        }
        
        // If response has data property with success
        if (response.data.data && response.data.data.success === true) {
          console.log('Solutions reordered successfully (nested data)');
          return {
            success: true,
            data: response.data.data.data || response.data.data,
            message: response.data.data.message || 'Solar solutions reordered successfully'
          };
        }
      }
      
      // If we couldn't parse the response in any expected format
      console.error('Unexpected reorder solutions response format:', response);
      return {
        success: false,
        message: 'Failed to reorder solar solutions'
      };
    } catch (error) {
      console.error('Error reordering solar solutions:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to reorder solar solutions'
      };
    }
  }
};

export default solarSolutionService;