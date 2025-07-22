import axios from 'axios';

// Create axios instance with base URL
// Using relative URL for proxy to work correctly
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API services for different endpoints
export const authService = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, passwords) => api.post(`/users/reset-password/${token}`, passwords),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

export const blogService = {
  getAllPosts: (params) => api.get('/blog-posts', { params }),
  getActivePosts: (params) => api.get('/blog-posts/active', { params }),
  getFeaturedPosts: () => api.get('/blog-posts/featured'),
  getPostById: (id) => api.get(`/blog-posts/id/${id}`),
  getPostBySlug: (slug) => api.get(`/blog-posts/slug/${slug}`),
  searchPosts: (query) => api.get(`/blog-posts/search?q=${query}`),
  getPostsByCategory: (categoryId, params) => api.get(`/blog-posts/category/${categoryId}`, { params }),
  getPostsByTag: (tagId, params) => api.get(`/blog-posts/tag/${tagId}`, { params }),
};

export const projectService = {
  getAllProjects: (params) => api.get('/projects', { params }),
  getActiveProjects: (params) => api.get('/projects/active', { params }),
  getFeaturedProjects: () => api.get('/projects/featured'),
  getProjectById: (id) => api.get(`/projects/id/${id}`),
  getProjectBySlug: (slug) => api.get(`/projects/slug/${slug}`),
  getProjectsByCategory: (categoryId, params) => api.get(`/projects/category/${categoryId}`, { params }),
};

export const journeyService = {
  getAllMilestones: (params) => api.get('/journey', { params }),
  getActiveMilestones: () => api.get('/journey/active', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getMilestoneById: (id) => api.get(`/journey/${id}`),
  createMilestone: (data) => api.post('/journey', data),
  updateMilestone: (id, data) => api.put(`/journey/${id}`, data),
  deleteMilestone: (id) => api.delete(`/journey/${id}`),
  reorderMilestones: (items) => api.put('/journey/reorder', { items }),
};

export const contactService = {
  submitContactForm: (formData) => api.post('/contacts', formData),
};

export const heroService = {
  getActiveSlides: () => api.get('/heroes/active'),
  getFeaturedSlides: () => api.get('/heroes/featured'),
  getSlideById: (id) => api.get(`/heroes/${id}`),
};

export const energySolutionService = {
  getAllSolutions: (params) => api.get('/energy-solutions', { params }),
  getActiveSolutions: (params) => api.get('/energy-solutions/active', { params }),
  getFeaturedSolutions: () => api.get('/energy-solutions/featured'),
  getSolutionById: (id) => api.get(`/energy-solutions/id/${id}`),
  getSolutionBySlug: (slug) => api.get(`/energy-solutions/slug/${slug}`),
};

export const productService = {
  getAllProducts: (params) => api.get('/products', { params }),
  getActiveProducts: (params) => api.get('/products/active', { params }),
  getFeaturedProducts: () => api.get('/products/featured'),
  getProductById: (id) => api.get(`/products/id/${id}`),
  getProductBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getProductsByCategory: (categoryId, params) => api.get(`/products/category/${categoryId}`, { params }),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
};

export const testimonialService = {
  getAllTestimonials: (params) => api.get('/testimonials', { params }),
  getActiveTestimonials: (params) => api.get('/testimonials/active', { params }),
  getFeaturedTestimonials: () => api.get('/testimonials/featured'),
  getTestimonialsByProjectType: (type) => api.get(`/testimonials/project-type/${type}`),
};

export const teamService = {
  getAllMembers: (params) => api.get('/team', { params }),
  getActiveMembers: (params) => api.get('/team/active', { params }),
  getFeaturedMembers: () => api.get('/team/featured'),
  getMembersByDepartment: (department) => api.get(`/team/department/${department}`),
};

export const careerService = {
  getAllCareers: (params) => api.get('/careers', { params }),
  getActiveCareers: (params) => api.get('/careers/active', { params }),
  getFeaturedCareers: () => api.get('/careers/featured'),
  getCareerBySlug: (slug) => api.get(`/careers/slug/${slug}`),
  searchCareers: (query) => api.get(`/careers/search?q=${query}`),
};

export const faqService = {
  getAllFaqs: (params) => api.get('/faqs', { params }),
  getActiveFaqs: (params) => api.get('/faqs/active', { params }),
  getFaqsByCategory: (categoryId) => api.get(`/faqs/category/${categoryId}`),
};

export const categoryService = {
  getAllCategories: (params) => api.get('/categories', { params }),
  getCategoriesByType: (type) => api.get(`/categories/type/${type}`),
  getFeaturedCategories: () => api.get('/categories/featured'),
  getCategoryBySlug: (slug) => api.get(`/categories/slug/${slug}`),
};

export const tagService = {
  getAllTags: (params) => api.get('/tags', { params }),
  getTagsByType: (type) => api.get(`/tags/type/${type}`),
  getTagBySlug: (slug) => api.get(`/tags/slug/${slug}`),
};

export const settingService = {
  getPublicSettings: () => api.get('/settings/public'),
};

export const co2EmissionReductionService = {
  getAllReductions: (params) => api.get('/co2-emission-reduction', { params }),
  getActiveReductions: () => api.get('/co2-emission-reduction/active', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getReductionById: (id) => api.get(`/co2-emission-reduction/${id}`),
  createReduction: (data) => api.post('/co2-emission-reduction', data),
  updateReduction: (id, data) => api.put(`/co2-emission-reduction/${id}`, data),
  deleteReduction: (id) => api.delete(`/co2-emission-reduction/${id}`),
  reorderReductions: (items) => api.put('/co2-emission-reduction/reorder', { items }),
};

export const intelligentSolutionService = {
  getAllSolutions: (params) => api.get('/intelligent-solution', { params }),
  getActiveSolutions: () => api.get('/intelligent-solution/active', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: { _t: new Date().getTime() }
  }),
  getSolutionById: (id) => api.get(`/intelligent-solution/${id}`),
  createSolution: (data) => api.post('/intelligent-solution', data),
  updateSolution: (id, data) => api.put(`/intelligent-solution/${id}`, data),
  deleteSolution: (id) => api.delete(`/intelligent-solution/${id}`),
  reorderSolutions: (items) => api.put('/intelligent-solution/reorder', { items }),
};

// Create a separate axios instance for chatbot API
const chatbotApi = axios.create({
  baseURL: import.meta.env.VITE_CHATBOT_API_URL || 'https://cosmic-support-chatbor.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: (message, conversationId) => chatbotApi.post('/api/chat/message', { message, conversationId }),
  getConversationHistory: (conversationId) => chatbotApi.get(`/api/chat/history/${conversationId}`),
  clearConversation: (conversationId) => chatbotApi.delete(`/api/chat/history/${conversationId}`),
  calculateROI: (monthlyBill, state) => chatbotApi.post('/api/chat/roi', { monthlyBill, state }),
};

export default api;