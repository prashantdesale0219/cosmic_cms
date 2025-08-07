import api from './api';

export const headerService = {
  // Get header data for dashboard
  getHeader: () => api.get('/header'),
  
  // Create new header
  createHeader: (data) => api.post('/header', data),
  
  // Update header
  updateHeader: (id, data) => api.put(`/header/${id}`, data),
  
  // Initialize header with default data
  initializeHeader: () => api.post('/header/initialize'),
  
  // Navigation management
  addNavigationItem: (data) => api.post('/header/navigation', data),
  updateNavigationItem: (id, data) => api.put(`/header/navigation/${id}`, data),
  deleteNavigationItem: (id) => api.delete(`/header/navigation/${id}`),
  reorderNavigationItems: (items) => api.put('/header/navigation/reorder', { items }),
  
  // Submenu management
  addSubmenuItem: (navId, data) => api.post(`/header/navigation/${navId}/submenu`, data),
  updateSubmenuItem: (navId, submenuId, data) => api.put(`/header/navigation/${navId}/submenu/${submenuId}`, data),
  deleteSubmenuItem: (navId, submenuId) => api.delete(`/header/navigation/${navId}/submenu/${submenuId}`),
  
  // Social links management
  addSocialLink: (data) => api.post('/header/social-links', data),
  updateSocialLink: (id, data) => api.put(`/header/social-links/${id}`, data),
  deleteSocialLink: (id) => api.delete(`/header/social-links/${id}`)
};