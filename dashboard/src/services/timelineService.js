import api from './api';

class TimelineService {
  // Get all timeline items
  async getAllTimeline(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/timeline/frontend?${queryString}` : '/timeline/frontend';
    
    return api.get(url);
  }

  // Get single timeline item
  async getTimelineItem(id) {
    return api.get(`/timeline/${id}`);
  }

  // Create new timeline item
  async createTimelineItem(data) {
    return api.post('/timeline', data);
  }

  // Update timeline item
  async updateTimelineItem(id, data) {
    return api.put(`/timeline/${id}`, data);
  }

  // Delete timeline item
  async deleteTimelineItem(id) {
    return api.delete(`/timeline/${id}`);
  }

  // Bulk delete timeline items
  async bulkDeleteTimeline(ids) {
    return api.post('/timeline/bulk-delete', { ids });
  }

  // Update timeline item status
  async updateTimelineStatus(id, isActive) {
    return api.patch(`/timeline/${id}/status`, { isActive });
  }

  // Get timeline for frontend (public)
  async getTimelineForFrontend() {
    return api.get('/frontend/timeline');
  }
}

export default new TimelineService();