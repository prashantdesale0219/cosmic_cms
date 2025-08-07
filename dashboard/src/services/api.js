import axios from 'axios';
import {
  staticHeroSlides,
  staticTeamMembers,
  staticProducts,
  staticProjects,
  staticBlogPosts,
  staticFaqs,
  staticTestimonials,
  staticCategories,
  staticTags,
  createPaginatedResponse,
  createApiResponse
} from '../data/staticData.js';

// Create axios instance with base URL
// Use environment variable or fallback to local development URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

// Add a flag to track if we've shown the database connection warning
let hasShownDbWarning = false;

// Helper function to handle API calls with static data fallback
const apiWithFallback = async (apiCall, staticData, options = {}) => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    console.warn('API call failed, using static data:', error.message);
    
    // Check if it's a network error or server unavailable
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || 
        error.response?.status >= 500 || !error.response) {
      
      // Show user-friendly message about offline mode
      if (!hasShownDbWarning) {
        console.info('🔄 Working in offline mode with sample data');
        hasShownDbWarning = true;
      }
      
      // Return static data in API response format
      if (options.paginated) {
        return {
          data: createPaginatedResponse(staticData, options.page, options.limit)
        };
      } else {
        return {
          data: createApiResponse(staticData)
        };
      }
    }
    
    // Re-throw other errors (like authentication errors)
    throw error;
  }
};

// Server status check function that can be used throughout the app
export const checkServerStatus = async () => {
  console.log('Checking server status from api.js...');
  
  // List of endpoints to try in order of preference
  const endpointsToTry = [
    { url: `${API_BASE_URL}/system-status`, name: 'system-status endpoint', method: 'get' },
    { url: `${API_BASE_URL}/health-check`, name: 'health-check endpoint', method: 'get' },
    { url: API_BASE_URL, name: 'API base URL', method: 'head' },
    { url: API_BASE_URL.split('/api')[0], name: 'server root', method: 'head' },
    { url: `${API_BASE_URL.split('/api')[0]}/health-check`, name: 'root health-check', method: 'get' }
  ];
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
  
  try {
    for (const endpoint of endpointsToTry) {
      try {
        console.log(`Trying to reach ${endpoint.name} at ${endpoint.url}`);
        
        const response = await axios[endpoint.method](endpoint.url, {
          signal: controller.signal,
          timeout: 5000,
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log(`Successfully connected to ${endpoint.name}`, response.status);
        
        // Check for database status if available
        let dbStatus = null;
        if (response.data && (response.data.database || response.data.db)) {
          dbStatus = response.data.database || response.data.db;
          console.log('Database status:', dbStatus);
          
          // If database is disconnected, log warning but don't fail the check
          if (dbStatus.status === 'disconnected' || dbStatus.status === 'error') {
            console.warn('Database connection issue detected:', dbStatus.error || 'Unknown database error');
            
            // Only show the warning once per session
            if (!hasShownDbWarning) {
              console.warn('Continuing with limited functionality. Some features may not work properly.');
              hasShownDbWarning = true;
            }
          }
        }
        
        clearTimeout(timeoutId);
        return { 
          success: true, 
          endpoint: endpoint.name, 
          status: response.status,
          database: dbStatus,
          serverData: response.data
        };
      } catch (err) {
        console.log(`Failed to reach ${endpoint.name}:`, err.message);
        console.log('Error details:', {
          code: err.code,
          status: err.response?.status,
          statusText: err.response?.statusText
        });
        // Continue to next endpoint
      }
    }
    
    // If we get here, all endpoints failed
    clearTimeout(timeoutId);
    return { success: false, error: 'All connection attempts failed' };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Server status check failed:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
};

// Enhanced database status check function with retry and detailed diagnostics
export const checkDatabaseStatus = async (retryAttempt = 0) => {
  console.log(`Checking database status from api.js... (attempt ${retryAttempt + 1})`);
  
  const MAX_RETRIES = 3;
  
  try {
    // Try to access the system status endpoint which includes database status
    const response = await axios.get(`${API_BASE_URL}/system-status`, {
      timeout: 8000 // 8 second timeout (increased from 5s)
    });
    
    if (response.data && response.data.database) {
      const dbStatus = response.data.database.status;
      const dbDetails = response.data.database;
      
      // Log detailed database information for debugging
      console.log('Database status details:', {
        status: dbStatus,
        readyState: dbDetails.readyState,
        host: dbDetails.host,
        name: dbDetails.name,
        pingTest: dbDetails.pingTest,
        timestamp: new Date().toISOString()
      });
      
      if (dbStatus === 'connected' || dbStatus === 'reconnected') {
        console.log('Database is connected and operational');
        // Reset the warning flag when database is back online
        hasShownDbWarning = false;
        return {
          success: true,
          connected: true,
          status: dbStatus,
          name: dbDetails.name,
          details: dbDetails
        };
      } else {
        console.warn(`Database is not connected. Status: ${dbStatus}`);
        
        // If we haven't reached max retries, try again
        if (retryAttempt < MAX_RETRIES) {
          console.log(`Retrying database check (${retryAttempt + 1}/${MAX_RETRIES})...`);
          // Wait with exponential backoff
          const delay = 2000 * Math.pow(2, retryAttempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          return checkDatabaseStatus(retryAttempt + 1);
        }
        
        // Show warning only once
        if (!hasShownDbWarning) {
          hasShownDbWarning = true;
        }
        
        return {
          success: false,
          connected: false,
          status: dbStatus,
          name: dbDetails.name,
          details: dbDetails,
          error: `Database connection issue. Status: ${dbStatus}`
        };
      }
    } else {
      console.warn('Could not determine database status');
      
      // If we haven't reached max retries, try again
      if (retryAttempt < MAX_RETRIES) {
        console.log(`Retrying database check (${retryAttempt + 1}/${MAX_RETRIES})...`);
        const delay = 2000 * Math.pow(2, retryAttempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        return checkDatabaseStatus(retryAttempt + 1);
      }
      
      return { success: false, error: 'No database information available' };
    }
  } catch (error) {
    console.error('Error checking database status:', error);
    
    // If we haven't reached max retries, try again
    if (retryAttempt < MAX_RETRIES) {
      console.log(`Retrying database check after error (${retryAttempt + 1}/${MAX_RETRIES})...`);
      const delay = 2000 * Math.pow(2, retryAttempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      return checkDatabaseStatus(retryAttempt + 1);
    }
    
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      message: 'Database connection issue. Please try again later.'
    };
  }
};

// Create a custom axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Auth-Token': localStorage.getItem('token') || ''
  },
  timeout: 15000, // 15 seconds timeout (reduced for faster response)
  withCredentials: false, // Disable sending cookies with requests
  // Retry logic for failed requests
  retry: 3, // Number of retry attempts (reduced from 10)
  retryDelay: 1000, // Delay between retries in milliseconds (reduced from 3000)
  // Exponential back-off for retries
  retryDelayOptions: { base: 1000, multiplier: 1.5 }
});

// Add retry logic for failed requests with exponential backoff
api.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
  const config = err.config;
  
  // If config does not exist or the retry option is not set, reject
  if (!config || !config.retry) return Promise.reject(err);
  
  // Skip retry for certain error types
  if (err.response) {
    // Don't retry for 4xx client errors except 408 (timeout) and 429 (too many requests)
    const status = err.response.status;
    if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
      return Promise.reject(err);
    }
  }
  
  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0;
  
  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    console.log(`Maximum retries reached (${config.retry}) for: ${config.url}`);
    return Promise.reject(err);
  }
  
  // Increase the retry count
  config.__retryCount += 1;
  
  // Calculate exponential backoff delay
  const options = config.retryDelayOptions || {};
  const baseDelay = options.base || config.retryDelay || 1000;
  const multiplier = options.multiplier || 1;
  const delay = baseDelay * Math.pow(multiplier, config.__retryCount - 1);
  
  console.log(`Retrying request (${config.__retryCount}/${config.retry}) after ${delay}ms: ${config.url}`);
  
  // Create new promise to handle exponential backoff
  const backoff = new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, delay);
  });
  
  // Return the promise in which recalls axios to retry the request
  return backoff.then(function() {
    // Make a new copy of the config to avoid issues
    const newConfig = {...config};
    return api(newConfig);
  });
});

// Add request interceptor to include auth token when available
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    
    // Log request details for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      timestamp: new Date().toISOString(),
      headers: config.headers,
      params: config.params,
      baseURL: config.baseURL
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Ensure token is properly formatted and not malformed
        if (token && token.trim() !== '') {
          // Validate token format (should be a string without spaces)
          if (token.includes(' ')) {
            console.warn('Token contains spaces, removing token');
            localStorage.removeItem('token');
            return config;
          }
          
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Adding token to request:', `Bearer ${token.substring(0, 10)}...`);
        } else {
          console.warn('Token is empty or malformed, removing token');
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.warn('Token validation error:', err.message);
        localStorage.removeItem('token'); // Remove invalid token
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor with enhanced error handling
api.interceptors.response.use(
  response => {
    // Any status code within the range of 2xx causes this function to trigger
    console.log(`API Response Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  async error => {
    // Any status codes outside the range of 2xx cause this function to trigger
    const originalRequest = error.config;
    
    // Log detailed error information
    console.error('API Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      timestamp: new Date().toISOString(),
      browserInfo: navigator.userAgent,
      onLine: navigator.onLine
    });
    
    // Skip retry for specific error types
    if (error.response && error.response.status === 401) {
      console.log('Session expired or unauthorized. Redirecting to login.');
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error); // Don't retry 401 errors
    }
    
    // Implement enhanced retry logic for network errors, database connection issues, and 5xx server errors
    if (
      (error.code === 'ERR_NETWORK' || 
       (error.response && error.response.status >= 500) ||
       (error.response && error.response.data && 
        (error.response.data.message?.includes('database') || 
         error.response.data.error?.includes('database') ||
         error.response.data.message?.includes('connection') ||
         error.response.data.error?.includes('connection')))) && 
      originalRequest && 
      !originalRequest._retry && 
      originalRequest.retry !== 0
    ) {
      // Track retry attempts
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      
      // Check if we've reached the maximum number of retries
      if (originalRequest._retry <= (originalRequest.retry || 3)) {
        console.log(`Retrying request (${originalRequest._retry}/${originalRequest.retry || 3})...`);
        
        // Calculate delay with exponential backoff
        const delay = originalRequest.retryDelay || 1000;
        const multiplier = originalRequest.retryDelayOptions?.multiplier || 1;
        const retryDelay = delay * Math.pow(multiplier, originalRequest._retry - 1);
        
        console.log(`Waiting ${retryDelay}ms before retry...`);
        
        // Check database status before retrying
        try {
          console.log('Checking database status before retry...');
          await checkDatabaseStatus();
          console.log('Database is now available, proceeding with retry');
        } catch (dbError) {
          console.warn('Database still unavailable:', dbError.message);
          // Continue with retry anyway
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        // Retry the request
        return api(originalRequest);
      }
    }
    
    // Enhanced handling for network errors (no internet connection, server down, etc.)
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error detected. Server might be down or unreachable.');
      console.log('Attempting to diagnose network issue...');
      
      // Add more diagnostic information
      error.customMessage = 'Network error: Unable to connect to the server. Please check your internet connection and verify the server is running.';
      
      // Add additional properties to help with debugging
      error.isNetworkError = true;
      error.timestamp = new Date().toISOString();
      error.apiUrl = error.config?.url;
      error.diagnosticInfo = {
        browserInfo: navigator.userAgent,
        connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
        onLine: navigator.onLine,
        timeOfError: new Date().toLocaleString(),
        apiBaseUrl: API_BASE_URL
      };
      
      // Log more detailed information about the request
      console.log('Failed request details:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout,
        headers: error.config?.headers,
        data: error.config?.data ? JSON.stringify(error.config.data).substring(0, 100) + '...' : 'none'
      });
      
      // Try to ping the server to check if it's reachable
      setTimeout(() => {
        console.log('Attempting to ping server...');
        fetch(API_BASE_URL.split('/api')[0] + '/health-check', { method: 'HEAD', mode: 'no-cors' })
          .then(() => console.log('Server ping successful - server appears to be running'))
          .catch(err => console.log('Server ping failed:', err.message));
      }, 500);
      
      // Retry logic will handle this if configured
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Server is taking too long to respond.');
      error.customMessage = 'Request timeout: The server is taking too long to respond. Please try again later.';
      // Retry logic will handle this if configured
    }
    
    // Handle CORS errors
    if (error.message && error.message.includes('Network Error') && !error.response) {
      console.error('Possible CORS issue or server is completely down');
      error.customMessage = 'Connection error: Unable to reach the server. This might be due to CORS restrictions or the server being down.';
    }
    
    // Check if we should retry the request
    const config = error.config;
    
    // If retry is configured and this isn't a 401 error, let the retry interceptor handle it
    if (config && config.retry) {
      // Let the retry interceptor handle this
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

const API_URL = 'http://localhost:5000/api/users';

export const loginUser = (email, password) =>
  axios.post(`${API_URL}/login`, { email, password });

export const registerUser = (name, email, password) =>
  axios.post(`${API_URL}/register`, { name, email, password });

// API services for different endpoints
export const authService = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, passwords) => api.post(`/users/reset-password/${token}`, passwords),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const dashboardService = {
  getStats: async () => {
    try {
      console.log('Fetching dashboard stats...');
      const response = await api.get('/dashboard-stats');
      console.log('Dashboard stats API response:', response);
      
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            message: response.data.message || 'Stats fetched successfully'
          };
        }
        
        // If response has status 200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          return {
            success: true,
            data: response.data,
            message: 'Stats fetched successfully'
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        data: {}
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch dashboard stats',
        data: {}
      };
    }
  },
  getDashboardStats: async () => {
    try {
      console.log('Fetching dashboard stats...');
      const response = await api.get('/dashboard-stats');
      console.log('Dashboard stats API response:', response);
      
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            message: response.data.message || 'Stats fetched successfully'
          };
        }
        
        // If response has status 200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          return {
            success: true,
            data: response.data,
            message: 'Stats fetched successfully'
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        data: {}
      };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch dashboard stats',
        data: {}
      };
    }
  },
};

export const heroService = {
  createSlide: (data) => api.post('/heroes', data),
  getAllSlides: (params = {}) => apiWithFallback(
    () => api.get('/heroes', { params }),
    staticHeroSlides,
    { paginated: true, page: params.page || 1, limit: params.limit || 10 }
  ),
  getActiveSlides: () => apiWithFallback(
    () => api.get('/heroes/active'),
    staticHeroSlides.filter(slide => slide.isActive)
  ),
  getFeaturedSlides: () => apiWithFallback(
    () => api.get('/heroes/featured'),
    staticHeroSlides.filter(slide => slide.isActive)
  ),
  getSlideById: (id) => {
    // For static data, find by ID
    const staticSlide = staticHeroSlides.find(slide => slide._id === id);
    return apiWithFallback(
      () => api.get(`/heroes/${id}`),
      staticSlide || staticHeroSlides[0]
    );
  },
  updateSlide: (id, data) => api.put(`/heroes/${id}`, data),
  deleteSlide: (id) => api.delete(`/heroes/${id}`),
  reorderSlides: (items) => api.put('/heroes/reorder', { items }),
};

export const blogService = {
  createPost: async (data) => {
    try {
      console.log('Creating blog post with data:', JSON.stringify(data, null, 2));
      
      // Ensure we have the required fields
      if (!data.title) {
        return {
          success: false,
          message: 'Blog post title is required'
        };
      }
      
      // Make sure slug is set
      if (!data.slug && data.title) {
        data.slug = data.title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        console.log('Generated slug from title:', data.slug);
      }
      
      const response = await api.post('/blog-posts', data);
      console.log('Blog post creation API response:', response);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            message: response.data.message || 'Blog post created successfully'
          };
        }
        
        // If response has status 201/200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          return {
            success: true,
            data: response.data,
            message: 'Blog post created successfully'
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error('Error in createPost:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create blog post',
        error: error
      };
    }
  },
  
  getAllPosts: async (params) => {
    return await apiWithFallback(
      () => api.get('/blog-posts', { params }),
      staticBlogPosts,
      {
        pagination: params,
        transform: (data) => {
          if (data.success !== undefined) {
            return data.data || data;
          }
          return data;
        }
      }
    );
  },
  
  getActivePosts: async (params) => {
    return await apiWithFallback(
      () => api.get('/blog-posts/active', { params }),
      staticBlogPosts.filter(post => post.isActive),
      { pagination: params }
    );
  },
  
  getFeaturedPosts: async () => {
    return await apiWithFallback(
      () => api.get('/blog-posts/featured'),
      staticBlogPosts.filter(post => post.featured)
    );
  },
  
  getPostById: async (id) => {
    return await apiWithFallback(
      () => api.get(`/blog-posts/id/${id}`),
      staticBlogPosts.find(post => post._id === id || post.id === id) || staticBlogPosts[0]
    );
  },
  
  getPostBySlug: async (slug) => {
    return await apiWithFallback(
      () => api.get(`/blog-posts/slug/${slug}`),
      staticBlogPosts.find(post => post.slug === slug) || staticBlogPosts[0]
    );
  },
  
  updatePost: async (id, data) => {
    try {
      console.log(`Updating blog post ${id} with data:`, JSON.stringify(data, null, 2));
      
      const response = await api.put(`/blog-posts/${id}`, data);
      console.log('Blog post update API response:', response);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            message: response.data.message || 'Blog post updated successfully'
          };
        }
        
        // If response has status 200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          return {
            success: true,
            data: response.data,
            message: 'Blog post updated successfully'
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error(`Error in updatePost(${id}):`, error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update blog post',
        error: error
      };
    }
  },
  
  deletePost: async (id) => {
    try {
      const response = await api.delete(`/blog-posts/${id}`);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            message: response.data.message || 'Blog post deleted successfully'
          };
        }
        
        // If response has status 200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          return {
            success: true,
            data: response.data,
            message: 'Blog post deleted successfully'
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error(`Error in deletePost(${id}):`, error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete blog post'
      };
    }
  },
  
  searchPosts: async (query) => {
    return await apiWithFallback(
      () => api.get(`/blog-posts/search?q=${query}`),
      staticBlogPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(query.toLowerCase())
      )
    );
  },
  
  getPostsByCategory: async (categoryId, params) => {
    return await apiWithFallback(
      () => api.get(`/blog-posts/category/${categoryId}`, { params }),
      staticBlogPosts.filter(post => post.category === categoryId || post.categoryId === categoryId),
      { pagination: params }
    );
  },
  
  getPostsByTag: async (tagId, params) => {
    return await apiWithFallback(
      () => api.get(`/blog-posts/tag/${tagId}`, { params }),
      staticBlogPosts.filter(post => 
        post.tags?.includes(tagId) || 
        post.tagIds?.includes(tagId)
      ),
      { pagination: params }
    );
  },
};

export const projectService = {
  createProject: async (data) => {
    try {
      // Ensure category is set before sending to API
      if (!data.category || data.category === '') {
        console.log('Setting default category to residential before API call');
        data.category = 'residential';
      }
      
      // Log the complete data being sent to API
      console.log('Creating project with data:', JSON.stringify(data, null, 2));
      
      const response = await api.post('/projects', data);
      console.log('Project creation API response:', response);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          // Make sure we're returning the correct structure
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            status: response.status,
            statusText: response.statusText
          };
        }
        
        // If response has status 201/200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          return {
            success: true,
            data: response.data,
            status: response.status,
            statusText: response.statusText
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error('Error in createProject:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create project',
        error: error
      };
    }
  },
  getAllProjects: async (params) => {
    try {
      console.log('Fetching all projects with params:', params);
      const response = await api.get('/projects', { params });
      console.log('All projects response:', response);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            status: response.status
          };
        }
        
        // If response has status 200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          // Format the response to match the expected structure
          return {
            success: true,
            data: Array.isArray(response.data) ? response.data : 
                  (response.data.projects || response.data.data || []),
            status: response.status
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format in getAllProjects:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error('Error in getAllProjects:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch all projects',
        error: error
      };
    }
  },
  getProjects: async (page = 1, limit = 10, search = '') => {
    const params = { page, limit };
    if (search) params.search = search;
    try {
      const response = await api.get('/projects', { params });
      return {
        success: true,
        data: {
          projects: response.data.projects || response.data,
          totalPages: response.data.totalPages || 1,
          currentPage: response.data.currentPage || page
        }
      };
    } catch (error) {
      console.error('Error in getProjects:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch projects'
      };
    }
  },
  getActiveProjects: async (params) => {
    try {
      console.log('Fetching active projects with params:', params);
      const response = await api.get('/projects/active', { params });
      console.log('Active projects response:', response);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            status: response.status
          };
        }
        
        // If response has status 200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          // Format the response to match the expected structure
          return {
            success: true,
            data: {
              projects: Array.isArray(response.data) ? response.data : 
                      (response.data.projects || response.data.data || []),
              totalPages: response.data.totalPages || 1,
              currentPage: response.data.currentPage || (params?.page || 1)
            },
            status: response.status
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format in getActiveProjects:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error('Error in getActiveProjects:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch active projects',
        error: error
      };
    }
  },
  getFeaturedProjects: async () => {
    try {
      console.log('Fetching featured projects');
      const response = await api.get('/projects/featured');
      console.log('Featured projects response:', response);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            status: response.status
          };
        }
        
        // If response has status 200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          // Format the response to match the expected structure
          return {
            success: true,
            data: Array.isArray(response.data) ? response.data : 
                  (response.data.projects || response.data.data || []),
            status: response.status
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format in getFeaturedProjects:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error('Error in getFeaturedProjects:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch featured projects',
        error: error
      };
    }
  },
  getProjectById: async (id) => {
    try {
      console.log(`Fetching project by ID: ${id}`);
      const response = await api.get(`/projects/id/${id}`);
      console.log('Project fetch by ID response:', response);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            status: response.status
          };
        }
        
        // If response has status 200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          return {
            success: true,
            data: response.data,
            status: response.status
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format in getProjectById:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error(`Error in getProjectById(${id}):`, error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch project',
        error: error
      };
    }
  },
  getProjectBySlug: async (slug) => {
    try {
      console.log(`Fetching project by slug: ${slug}`);
      const response = await api.get(`/projects/slug/${slug}`);
      console.log('Project fetch by slug response:', response);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            status: response.status
          };
        }
        
        // If response has status 200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          return {
            success: true,
            data: response.data,
            status: response.status
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format in getProjectBySlug:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error(`Error in getProjectBySlug(${slug}):`, error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch project',
        error: error
      };
    }
  },
  updateProject: async (id, data) => {
    try {
      // Ensure category is set before sending to API
      if (!data.category || data.category === '') {
        console.log('Setting default category to residential before API call');
        data.category = 'residential';
      }
      
      // Log the complete data being sent to API
      console.log(`Updating project ${id} with data:`, JSON.stringify(data, null, 2));
      
      const response = await api.put(`/projects/${id}`, data);
      console.log('Project update API response:', response);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          // Make sure we're returning the correct structure
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            status: response.status,
            statusText: response.statusText
          };
        }
        
        // If response has status 200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          return {
            success: true,
            data: response.data,
            status: response.status,
            statusText: response.statusText
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error(`Error in updateProject(${id}):`, error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update project',
        error: error
      };
    }
  },
  deleteProject: async (id) => {
    try {
      console.log(`Deleting project with ID: ${id}`);
      const response = await api.delete(`/projects/${id}`);
      console.log('Project deletion response:', response);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            message: response.data.message || 'Project deleted successfully',
            status: response.status
          };
        }
        
        // If response has status 200/204 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          return {
            success: true,
            data: response.data,
            message: 'Project deleted successfully',
            status: response.status
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format in deleteProject:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error(`Error in deleteProject(${id}):`, error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete project',
        error: error
      };
    }
  },
  reorderProjects: async (items) => {
    try {
      console.log('Reordering projects with items:', items);
      const response = await api.put('/projects/reorder', { items });
      console.log('Project reordering response:', response);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            message: response.data.message || 'Projects reordered successfully',
            status: response.status
          };
        }
        
        // If response has status 200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          return {
            success: true,
            data: response.data,
            message: 'Projects reordered successfully',
            status: response.status
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format in reorderProjects:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error('Error in reorderProjects:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to reorder projects',
        error: error
      };
    }
  },
  getProjectsByCategory: async (categoryId, params) => {
    try {
      console.log(`Fetching projects by category ID: ${categoryId}`);
      const response = await api.get(`/projects/category/${categoryId}`, { params });
      console.log('Projects by category response:', response);
      
      // Process the response to ensure consistent format
      if (response && response.data) {
        // If the backend returns a success property, use it
        if (response.data.success !== undefined) {
          return {
            success: response.data.success,
            data: response.data.data || response.data,
            status: response.status
          };
        }
        
        // If response has status 200 and data, consider it successful
        if (response.status >= 200 && response.status < 300) {
          // Format the response to match the expected structure
          return {
            success: true,
            data: {
              projects: Array.isArray(response.data) ? response.data : 
                      (response.data.projects || response.data.data || []),
              totalPages: response.data.totalPages || 1,
              currentPage: response.data.currentPage || (params?.page || 1)
            },
            status: response.status
          };
        }
      }
      
      // Fallback for unexpected response format
      console.warn('Unexpected response format in getProjectsByCategory:', response);
      return {
        success: false,
        message: 'Invalid response format from server',
        rawResponse: response
      };
    } catch (error) {
      console.error(`Error in getProjectsByCategory(${categoryId}):`, error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch projects by category',
        error: error
      };
    }
  },
};

export const productService = {
  createProduct: async (data) => {
    try {
      const response = await api.post('/products', data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error in createProduct:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create product'
      };
    }
  },
  updateProduct: async (id, data) => {
    try {
      const response = await api.put(`/products/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error in updateProduct:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update product'
      };
    }
  },
  getAllProducts: (params = {}) => apiWithFallback(
    () => api.get('/products', { params }),
    staticProducts,
    { paginated: true, page: params.page || 1, limit: params.limit || 10 }
  ),
  getActiveProducts: (params = {}) => apiWithFallback(
    () => api.get('/products/active', { params }),
    staticProducts.filter(product => product.isActive),
    { paginated: true, page: params.page || 1, limit: params.limit || 10 }
  ),
  getFeaturedProducts: () => apiWithFallback(
    () => api.get('/products/featured'),
    staticProducts.filter(product => product.isFeatured)
  ),
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/id/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error in getProductById:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch product'
      };
    }
  },
  getProductBySlug: (slug) => {
    const staticProduct = staticProducts.find(product => product.slug === slug);
    return apiWithFallback(
      () => api.get(`/products/slug/${slug}`),
      staticProduct || staticProducts[0]
    );
  },
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete product'
      };
    }
  },
  reorderProducts: (items) => api.put('/products/reorder', { items }),
  getProductsByCategory: (categoryId, params = {}) => apiWithFallback(
    () => api.get(`/products/category/${categoryId}`, { params }),
    staticProducts.filter(product => product.category === categoryId),
    { paginated: true, page: params.page || 1, limit: params.limit || 10 }
  ),
  searchProducts: (query) => apiWithFallback(
    () => api.get(`/products/search?q=${query}`),
    staticProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    )
  ),
};

export const faqService = {
  createFaq: async (data) => {
    try {
      const response = await api.post('/faqs', data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error in createFaq:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create FAQ'
      };
    }
  },
  bulkCreateFaqs: async (data) => {
    try {
      const response = await api.post('/faqs/bulk', data);
      return response.data;
    } catch (error) {
      console.error('Error in bulkCreateFaqs:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to bulk create FAQs'
      };
    }
  },
  getAllFaqs: async (params = {}) => {
    try {
      const response = await apiWithFallback(
        () => api.get('/faqs/active', { params }),
        staticFaqs,
        { paginated: true, page: params.page || 1, limit: params.limit || 10 }
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error in getAllFaqs:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch FAQs'
      };
    }
  },
  getActiveFaqs: () => apiWithFallback(
    () => api.get('/faqs/active'),
    staticFaqs.filter(faq => faq.isActive)
  ),
  getFaqsByCategory: (categoryId) => api.get(`/faqs/category/${categoryId}`),
  getFaqById: async (id) => {
    try {
      const response = await api.get(`/faqs/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error in getFaqById:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch FAQ'
      };
    }
  },
  updateFaq: async (id, data) => {
    try {
      const response = await api.put(`/faqs/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error in updateFaq:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update FAQ'
      };
    }
  },
  deleteFaq: async (id) => {
    try {
      const response = await api.delete(`/faqs/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error in deleteFaq:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete FAQ'
      };
    }
  },
  reorderFaqs: (items) => api.put('/faqs/reorder', { items }),
};

export const testimonialService = {
  createTestimonial: async (data) => {
    try {
      const response = await api.post('/testimonials', data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error in createTestimonial:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create testimonial'
      };
    }
  },
  getTestimonials: async (page = 1, limit = 10, query = '', sort = 'createdAt', direction = 'desc') => {
    try {
      const response = await api.get('/testimonials', { 
        params: { page, limit, search: query, sort, direction } 
      });
      
      if (response && response.data && response.data.success) {
        const testimonials = Array.isArray(response.data.data) ? response.data.data : [];
        const pagination = response.data.pagination || {};
        
        return {
          success: true,
          data: {
            testimonials: testimonials,
            totalPages: pagination.totalPages || Math.ceil((response.data.totalCount || testimonials.length) / limit),
            currentPage: pagination.page || page,
            totalCount: response.data.totalCount || testimonials.length
          }
        };
      }
      
      return {
        success: false,
        data: {
          testimonials: [],
          totalPages: 1,
          currentPage: page,
          totalCount: 0
        },
        error: 'Unexpected response format'
      };
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return {
        success: false,
        data: {
          testimonials: [],
          totalPages: 1,
          currentPage: page,
          totalCount: 0
        },
        error: error.message || 'Failed to fetch testimonials'
      };
    }
  },
  getTestimonialById: async (id) => {
    try {
      const response = await api.get(`/testimonials/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error in getTestimonialById:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch testimonial'
      };
    }
  },
  updateTestimonial: async (id, data) => {
    try {
      const response = await api.put(`/testimonials/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error in updateTestimonial:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update testimonial'
      };
    }
  },
  deleteTestimonial: async (id) => {
    try {
      const response = await api.delete(`/testimonials/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error in deleteTestimonial:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete testimonial'
      };
    }
  }
};

export const teamService = {
  createTeamMember: (data) => api.post('/team', data),
  getAllTeamMembers: (params = {}) => apiWithFallback(
    () => api.get('/team', { params }),
    staticTeamMembers,
    { paginated: true, page: params.page || 1, limit: params.limit || 10 }
  ),
  getActiveTeamMembers: () => apiWithFallback(
    () => api.get('/team/active'),
    staticTeamMembers.filter(member => member.isActive)
  ),
  getFeaturedTeamMembers: () => apiWithFallback(
    () => api.get('/team/featured'),
    staticTeamMembers.filter(member => member.isActive)
  ),
  getTeamMembersByDepartment: (department) => apiWithFallback(
    () => api.get(`/team/department/${department}`),
    staticTeamMembers.filter(member => member.department === department)
  ),
  getTeamMemberById: (id) => {
    const staticMember = staticTeamMembers.find(member => member._id === id);
    return apiWithFallback(
      () => api.get(`/team/${id}`),
      staticMember || staticTeamMembers[0]
    );
  },
  updateTeamMember: (id, data) => api.put(`/team/${id}`, data),
  deleteTeamMember: (id) => api.delete(`/team/${id}`),
  reorderTeamMembers: (items) => api.put('/team/reorder', { items }),
};

export const contactService = {
  getAllContacts: (params) => api.get('/contacts', { params }),
  getContactsByStatus: (status, params) => api.get(`/contacts/status/${status}`, { params }),
  getUnreadContacts: (params) => api.get('/contacts/unread', { params }),
  getAssignedContacts: (userId, params) => api.get(`/contacts/assigned/${userId}`, { params }),
  getContactById: (id) => api.get(`/contacts/${id}`),
  updateContact: (id, data) => api.put(`/contacts/${id}`, data),
  markContactAsRead: (id) => api.put(`/contacts/${id}/read`),
  assignContact: (id, userId) => api.put(`/contacts/${id}/assign`, { userId }),
  updateContactStatus: (id, status) => api.put(`/contacts/${id}/status`, { status }),
  addContactNotes: (id, notes) => api.put(`/contacts/${id}/notes`, { notes }),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
};

export const categoryService = {
  createCategory: (data) => api.post('/categories', data),
  
  getAllCategories: async () => {
    return await apiWithFallback(
      () => api.get('/categories'),
      staticCategories,
      {
        transform: (data) => {
          // Handle different response structures
          if (Array.isArray(data)) {
            return data;
          }
          if (data.data && Array.isArray(data.data)) {
            return data.data;
          }
          if (data.success && data.categories && Array.isArray(data.categories)) {
            return data.categories;
          }
          if (data.categories && Array.isArray(data.categories)) {
            return data.categories;
          }
          if (data.results && Array.isArray(data.results)) {
            return data.results;
          }
          if (typeof data === 'object' && !Array.isArray(data) && (data.name || data._id)) {
            return [data];
          }
          return data;
        }
      }
    );
  },
  
  // Added getCategories method with pagination, search, and sorting support
  getCategories: async (page = 1, limit = 10, query = '', sort = 'name', direction = 'asc') => {
    return await apiWithFallback(
      () => api.get('/categories', { params: { page, limit, query, sort, direction } }),
      staticCategories,
      {
        pagination: { page, limit, query, sort, direction },
        transform: (data) => {
          // Handle different response structures
          if (data.categories && Array.isArray(data.categories)) {
            return {
              categories: data.categories,
              totalPages: data.totalPages || 1,
              currentPage: data.currentPage || page,
              totalCount: data.totalCount || data.categories.length
            };
          }
          if (data.data && Array.isArray(data.data)) {
            return {
              categories: data.data,
              totalPages: data.totalPages || 1,
              currentPage: data.currentPage || page,
              totalCount: data.totalCount || data.data.length
            };
          }
          if (Array.isArray(data)) {
            return {
              categories: data,
              totalPages: 1,
              currentPage: 1,
              totalCount: data.length
            };
          }
          return {
            categories: [],
            totalPages: 1,
            currentPage: 1,
            totalCount: 0
          };
        }
      }
    );
  },
  
  getCategoriesByType: async (type) => {
    return await apiWithFallback(
      () => api.get(`/categories/type/${type}`),
      staticCategories.filter(category => category.type === type)
    );
  },
  getFeaturedCategories: async () => {
    return await apiWithFallback(
      () => api.get('/categories/featured'),
      staticCategories.filter(category => category.featured)
    );
  },
  getCategoryById: async (id) => {
    return await apiWithFallback(
      () => api.get(`/categories/id/${id}`),
      staticCategories.find(category => category._id === id || category.id === id) || staticCategories[0]
    );
  },
  getCategoryBySlug: async (slug) => {
    return await apiWithFallback(
      () => api.get(`/categories/slug/${slug}`),
      staticCategories.find(category => category.slug === slug) || staticCategories[0]
    );
  },
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  reorderCategories: (items) => api.put('/categories/reorder', { items }),
};

export const tagService = {
  createTag: (data) => api.post('/tags', data),
  getAllTags: async () => {
    return await apiWithFallback(
      () => api.get('/tags'),
      staticTags
    );
  },
  getTagsByType: async (type) => {
    return await apiWithFallback(
      () => api.get(`/tags/type/${type}`),
      staticTags.filter(tag => tag.type === type)
    );
  },
  getTagById: async (id) => {
    return await apiWithFallback(
      () => api.get(`/tags/id/${id}`),
      staticTags.find(tag => tag._id === id || tag.id === id) || staticTags[0]
    );
  },
  getTagBySlug: async (slug) => {
    return await apiWithFallback(
      () => api.get(`/tags/slug/${slug}`),
      staticTags.find(tag => tag.slug === slug) || staticTags[0]
    );
  },
  updateTag: (id, data) => api.put(`/tags/${id}`, data),
  deleteTag: (id) => api.delete(`/tags/${id}`),
};

export const mediaService = {
  uploadMedia: (formData) => api.post('/media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getAllMedia: () => api.get('/media'),
  getPublicMedia: () => api.get('/media/public'),
  getMediaByType: (type) => api.get(`/media/type/${type}`),
  getMediaByFolder: (folder) => api.get(`/media/folder/${folder}`),
  getMediaById: (id) => api.get(`/media/${id}`),
  updateMedia: (id, data) => api.put(`/media/${id}`, data),
  deleteMedia: (id) => api.delete(`/media/${id}`),
  bulkDeleteMedia: (ids) => api.post('/media/bulk-delete', { ids }),
  updateMediaTags: (id, tags) => api.put(`/media/${id}/tags`, { tags }),
  getMediaFolders: () => api.get('/media-folders'),
  // Enhanced getMedia method with proper error handling
  getMedia: async (page = 1, limit = 12) => {
    try {
      console.log(`Fetching media with page=${page}, limit=${limit}`);
      const response = await api.get('/media', { params: { page, limit } });
      console.log('Raw media API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // Process media items to ensure they have proper URL properties
        const processMediaItems = (items) => {
          if (!Array.isArray(items)) return [];
          
          return items.map(item => {
            // If item is already a string (URL), return an object with that URL
            if (typeof item === 'string') {
              return { url: item, fullUrl: item };
            }
            
            // Clone the item to avoid modifying the original
            const processedItem = { ...item };
            
            // Ensure URL properties are set
            if (!processedItem.url && processedItem.path) {
              processedItem.url = processedItem.path;
            }
            
            if (!processedItem.fullUrl && processedItem.url) {
              // If URL is relative, convert to absolute
              if (processedItem.url.startsWith('/')) {
                const backendBaseUrl = 'http://localhost:5000';
                processedItem.fullUrl = `${backendBaseUrl}${processedItem.url}`;
                processedItem.backendUrl = processedItem.fullUrl;
              } else if (!processedItem.url.startsWith('http')) {
                // If not absolute, assume it's relative to backend
                const backendBaseUrl = 'http://localhost:5000';
                processedItem.fullUrl = `${backendBaseUrl}/${processedItem.url}`;
                processedItem.backendUrl = processedItem.fullUrl;
              } else {
                processedItem.fullUrl = processedItem.url;
              }
            }
            
            return processedItem;
          });
        };
        
        // If response.data is already in the expected format with media array
        if (response.data.media && Array.isArray(response.data.media)) {
          console.log('Found media array in response.data.media');
          const processedMedia = processMediaItems(response.data.media);
          return {
            success: true,
            data: {
              data: processedMedia, // Ensure data.data format for consistency
              totalPages: response.data.totalPages || 1,
              currentPage: response.data.currentPage || page,
              totalCount: response.data.totalCount || processedMedia.length
            }
          };
        }
        
        // If response.data is an array of media items
        if (Array.isArray(response.data)) {
          console.log('Found media as array in response.data');
          const processedMedia = processMediaItems(response.data);
          return {
            success: true,
            data: {
              data: processedMedia, // Ensure data.data format for consistency
              totalPages: 1,
              currentPage: 1,
              totalCount: processedMedia.length
            }
          };
        }
        
        // If response.data has a nested data structure
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('Found media in response.data.data');
          const processedMedia = processMediaItems(response.data.data);
          return {
            success: true,
            data: {
              data: processedMedia, // Keep data.data format
              totalPages: response.data.totalPages || response.data.meta?.totalPages || 1,
              currentPage: response.data.currentPage || response.data.meta?.currentPage || page,
              totalCount: response.data.totalCount || response.data.meta?.totalCount || processedMedia.length
            }
          };
        }
        
        // If response.data has a results array (another possible API format)
        if (response.data.results && Array.isArray(response.data.results)) {
          console.log('Found media in response.data.results');
          const processedMedia = processMediaItems(response.data.results);
          return {
            success: true,
            data: {
              data: processedMedia, // Map to data.data format
              totalPages: response.data.totalPages || response.data.meta?.totalPages || 1,
              currentPage: response.data.currentPage || response.data.meta?.currentPage || page,
              totalCount: response.data.totalCount || response.data.meta?.totalCount || processedMedia.length
            }
          };
        }
        
        // If we have any object that might contain media files
        if (typeof response.data === 'object' && !Array.isArray(response.data)) {
          console.log('Attempting to extract media from response.data object');
          // Look for any array property that might contain media
          const possibleMediaArrays = Object.entries(response.data)
            .filter(([_key, value]) => Array.isArray(value))
            .sort(([_key1, a], [_key2, b]) => b.length - a.length); // Sort by array length (descending)
          
          if (possibleMediaArrays.length > 0) {
            const [arrayName, mediaArray] = possibleMediaArrays[0];
            console.log(`Found possible media array in response.data.${arrayName}`);
            const processedMedia = processMediaItems(mediaArray);
            return {
              success: true,
              data: {
                data: processedMedia,
                totalPages: response.data.totalPages || response.data.meta?.totalPages || 1,
                currentPage: response.data.currentPage || response.data.meta?.currentPage || page,
                totalCount: response.data.totalCount || response.data.meta?.totalCount || processedMedia.length
              }
            };
          }
        }
      }
      
      // If we couldn't parse the response in any expected format
      console.error('Unexpected media response format:', response);
      return {
        success: false,
        message: 'Failed to parse media data',
        data: {
          data: [], // Use data.data format for consistency
          totalPages: 1,
          currentPage: 1,
          totalCount: 0
        }
      };
    } catch (error) {
      console.error('Error fetching media:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch media',
        data: {
          data: [], // Use data.data format for consistency
          totalPages: 1,
          currentPage: 1,
          totalCount: 0
        }
      };
    }
  },
};

export const menuService = {
  createMenu: (data) => api.post('/menus', data),
  getAllMenus: () => api.get('/menus'),
  getMenusByLocation: (location) => api.get(`/menus/location/${location}`),
  getMenuById: (id) => api.get(`/menus/id/${id}`),
  getMenuBySlug: (slug) => api.get(`/menus/slug/${slug}`),
  updateMenu: (id, data) => api.put(`/menus/${id}`, data),
  deleteMenu: (id) => api.delete(`/menus/${id}`),
  addMenuItem: (id, item) => api.post(`/menus/${id}/items`, item),
  updateMenuItem: (id, itemId, item) => api.put(`/menus/${id}/items/${itemId}`, item),
  deleteMenuItem: (id, itemId) => api.delete(`/menus/${id}/items/${itemId}`),
  reorderMenuItems: (id, items) => api.put(`/menus/${id}/reorder`, { items }),
};

export const settingsService = {
  getSettings: () => api.get('/settings'),
  getPublicSettings: () => api.get('/settings/public'),
  updateSettings: (data) => api.put('/settings', data),
  updateMaintenanceMode: (data) => api.put('/settings/maintenance', data),
  updateSocialMedia: (data) => api.put('/settings/social-media', data),
  updateSeoSettings: (data) => api.put('/settings/seo', data),
  updateContactInfo: (data) => api.put('/settings/contact', data),
  updateScripts: (data) => api.put('/settings/scripts', data),
  // Advanced settings methods
  getAdvancedSettings: () => api.get('/settings/advanced'),
  updateAdvancedSettings: (data) => api.put('/settings/advanced', data),
  clearCache: () => api.post('/settings/clear-cache'),
  rebuildSearchIndex: () => api.post('/settings/rebuild-index')
};

// Keep the singular version for backward compatibility
export const settingService = settingsService;

export const happyClientService = {
  createHappyClient: (data) => api.post('/happy-clients', data),
  getAllHappyClients: () => api.get('/happy-clients'),
  getActiveHappyClients: () => api.get('/happy-clients/active'),
  getHappyClientById: (id) => api.get(`/happy-clients/${id}`),
  updateHappyClient: (id, data) => api.put(`/happy-clients/${id}`, data),
  deleteHappyClient: (id) => api.delete(`/happy-clients/${id}`),
  getActiveHappyClient: () => api.get('/happy-clients/active')
};

// About Services
export const aboutService = {
  // About Hero
  getAboutHero: () => api.get('/about/hero'),
  createAboutHero: (data) => api.post('/about/hero', data),
  updateAboutHero: (data) => api.put('/about/hero', data),
  
  // About Us
  getAboutUs: () => api.get('/about/about-us'),
  createAboutUs: (data) => api.post('/about/about-us', data),
  updateAboutUs: (data) => api.put('/about/about-us', data),
  
  // Who We Are
  getWhoWeAre: () => api.get('/about/who-we-are'),
  createWhoWeAre: (data) => api.post('/about/who-we-are', data),
  updateWhoWeAre: (data) => api.put('/about/who-we-are', data),
  
  // Our Expertise
  getOurExpertise: () => api.get('/about/our-expertise'),
  createOurExpertise: (data) => api.post('/about/our-expertise', data),
  updateOurExpertise: (data) => api.put('/about/our-expertise', data),
  
  // Why Choose Cosmic
  getWhyChooseCosmic: () => api.get('/about/why-choose-cosmic'),
  createWhyChooseCosmic: (data) => api.post('/about/why-choose-cosmic', data),
  updateWhyChooseCosmic: (data) => api.put('/about/why-choose-cosmic', data),
  
  // Vision Mission Values
  getVisionMissionValues: () => api.get('/about/vision-mission-values'),
  createVisionMissionValues: (data) => api.post('/about/vision-mission-values', data),
  updateVisionMissionValues: (data) => api.put('/about/vision-mission-values', data),
  
  // Get all about data
  getAllAboutData: () => api.get('/about/all')
};

// Director Services
export const directorService = {
  // Director Hero
  getDirectorHero: () => api.get('/director/hero'),
  createDirectorHero: (data) => api.post('/director/hero', data),
  updateDirectorHero: (data) => api.put('/director/hero', data),
  
  // Directors
  getDirectors: () => api.get('/director/directors'),
  getDirectorById: (id) => api.get(`/director/directors/${id}`),
  createDirector: (data) => api.post('/director/directors', data),
  updateDirector: (id, data) => api.put(`/director/directors/${id}`, data),
  deleteDirector: (id) => api.delete(`/director/directors/${id}`),
  
  // Director CTA
  getDirectorCTA: () => api.get('/director/cta'),
  createDirectorCTA: (data) => api.post('/director/cta', data),
  updateDirectorCTA: (data) => api.put('/director/cta', data)
};

// Service Services
export const serviceService = {
  // Service Hero
  getServiceHero: () => api.get('/services/hero'),
  createServiceHero: (data) => api.post('/services/hero', data),
  updateServiceHero: (data) => api.put('/services/hero', data),
  
  // Main Services
  getMainServices: () => api.get('/services/main-services'),
  getMainServiceById: (id) => api.get(`/services/main-services/${id}`),
  createMainService: (data) => api.post('/services/main-services', data),
  updateMainService: (id, data) => api.put(`/services/main-services/${id}`, data),
  deleteMainService: (id) => api.delete(`/services/main-services/${id}`),
  
  // Additional Services
  getAdditionalServices: () => api.get('/services/additional-services'),
  getAdditionalServiceById: (id) => api.get(`/services/additional-services/${id}`),
  createAdditionalService: (data) => api.post('/services/additional-services', data),
  updateAdditionalService: (id, data) => api.put(`/services/additional-services/${id}`, data),
  deleteAdditionalService: (id) => api.delete(`/services/additional-services/${id}`),
  
  // Process Steps
  getProcessSteps: () => api.get('/services/process-steps'),
  getProcessStepById: (id) => api.get(`/services/process-steps/${id}`),
  createProcessStep: (data) => api.post('/services/process-steps', data),
  updateProcessStep: (id, data) => api.put(`/services/process-steps/${id}`, data),
  deleteProcessStep: (id) => api.delete(`/services/process-steps/${id}`),
  
  // Service CTA
  getServiceCTA: () => api.get('/services/cta'),
  createServiceCTA: (data) => api.post('/services/cta', data),
  updateServiceCTA: (data) => api.put('/services/cta', data)
};

// Company Culture Services
export const companyCultureService = {
  // Company Culture Hero
  getCompanyCultureHero: () => api.get('/company-culture/hero'),
  createCompanyCultureHero: (data) => api.post('/company-culture/hero', data),
  updateCompanyCultureHero: (data) => api.put('/company-culture/hero', data),
  
  // Brand Vision
  getBrandVision: () => api.get('/company-culture/brand-vision'),
  createBrandVision: (data) => api.post('/company-culture/brand-vision', data),
  updateBrandVision: (data) => api.put('/company-culture/brand-vision', data),
  
  // Core Values
  getCoreValues: () => api.get('/company-culture/core-values'),
  getCoreValueById: (id) => api.get(`/company-culture/core-values/${id}`),
  createCoreValue: (data) => api.post('/company-culture/core-values', data),
  updateCoreValue: (id, data) => api.put(`/company-culture/core-values/${id}`, data),
  deleteCoreValue: (id) => api.delete(`/company-culture/core-values/${id}`),
  
  // Work Environment
  getWorkEnvironment: () => api.get('/company-culture/work-environment'),
  getWorkEnvironmentById: (id) => api.get(`/company-culture/work-environment/${id}`),
  createWorkEnvironment: (data) => api.post('/company-culture/work-environment', data),
  updateWorkEnvironment: (id, data) => api.put(`/company-culture/work-environment/${id}`, data),
  deleteWorkEnvironment: (id) => api.delete(`/company-culture/work-environment/${id}`),
  
  // Join Team CTA
  getJoinTeamCTA: () => api.get('/company-culture/join-team-cta'),
  createJoinTeamCTA: (data) => api.post('/company-culture/join-team-cta', data),
  updateJoinTeamCTA: (data) => api.put('/company-culture/join-team-cta', data)
};

export default api;