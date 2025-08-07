import api from './api';

export const footerService = {
  // Get footer data for dashboard
  getFooter: () => api.get('/footer'),
  
  // Create new footer
  createFooter: (data) => api.post('/footer', data),
  
  // Update footer
  updateFooter: (id, data) => api.put(`/footer/${id}`, data),
  
  // Initialize footer with default data
  initializeFooter: () => api.post('/footer/initialize'),
  
  // Footer sections management
  addFooterSection: (data) => api.post('/footer/sections', data),
  updateFooterSection: (id, data) => api.put(`/footer/sections/${id}`, data),
  deleteFooterSection: (id) => api.delete(`/footer/sections/${id}`),
  reorderFooterSections: (sections) => api.put('/footer/sections/reorder', { sections }),
  
  // Footer section links management
  addSectionLink: (sectionId, data) => api.post(`/footer/sections/${sectionId}/links`, data),
  updateSectionLink: (sectionId, linkId, data) => api.put(`/footer/sections/${sectionId}/links/${linkId}`, data),
  deleteSectionLink: (sectionId, linkId) => api.delete(`/footer/sections/${sectionId}/links/${linkId}`),
  
  // Social links management
  addSocialLink: (data) => api.post('/footer/social-links', data),
  updateSocialLink: (id, data) => api.put(`/footer/social-links/${id}`, data),
  deleteSocialLink: (id) => api.delete(`/footer/social-links/${id}`),
  
  // Newsletter subscription
  subscribeNewsletter: (email) => api.post('/footer/newsletter/subscribe', { email })
};