import api from './api';

const mediaService = {
  // Upload media file
  uploadMedia: async (file) => {
    try {
      const formData = new FormData();
      formData.append('media', file);
      
      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  },

  // Get all media files
  getAllMedia: async (params = {}) => {
    try {
      const response = await api.get('/media/public', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  },

  // Get media files with pagination (for blog posts)
  getMedia: async (page = 1, limit = 12) => {
    try {
      const response = await api.get('/media/public', { 
        params: { page, limit } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  },

  // Get media files with pagination and type filter (for testimonials)
  getMediaFiles: async (page = 1, limit = 12, type = null) => {
    try {
      const params = { page, limit };
      if (type) {
        params.type = type;
      }
      const response = await api.get('/media/public', { params });
      
      // Format response to match expected structure
      if (response.success && response.data) {
        return {
          success: true,
          data: {
            files: response.data,
            totalPages: response.pagination?.totalPages || 1,
            currentPage: response.pagination?.page || page
          }
        };
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching media files:', error);
      throw error;
    }
  },

  // Delete media file
  deleteMedia: async (id) => {
    try {
      const response = await api.delete(`/media/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  },
};

export default mediaService;