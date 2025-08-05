import api from './api';

export const solarSolutionService = {
  getAllSolutions: (params) => api.get('/solar-solutions', { params }),
  getActiveSolutions: (params) => api.get('/solar-solutions/active', { params }),
  getFeaturedSolutions: () => api.get('/solar-solutions/featured'),
  getSolutionById: (id) => api.get(`/solar-solutions/${id}`),
  getSolutionBySlug: (slug) => api.get(`/solar-solutions/slug/${slug}`),
};

export default solarSolutionService;