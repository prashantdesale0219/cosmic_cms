import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching user profile...');
      const response = await authService.getProfile();
      console.log('Profile response:', response.data);
      
      // Extract user data from the response
      if (!response.data || !response.data.data) {
        throw new Error('Invalid profile response format');
      }
      
      const userData = response.data.data;
      console.log('User data extracted:', userData);
      
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      const errorMessage = err.response?.status === 401 
        ? 'Authentication failed. Please login again.' 
        : err.message || 'Session expired. Please login again.';
      
      setError(errorMessage);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log('Attempting login with credentials:', { email: credentials.email, password: '******' });
      
      // Add timeout handling with increased timeout for potential database connection issues
      const response = await Promise.race([
        authService.login(credentials),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Login request timed out')), 30000)
        )
      ]);
      
      console.log('Login response received:', response.status);
      console.log('Login response data:', response.data);
      
      // Extract token and user data from the response
      if (!response.data) {
        throw new Error('Invalid response: No data received');
      }
      
      const { data } = response.data;
      
      if (!data || !data.token) {
        throw new Error('Invalid response format: token not found');
      }
      
      const token = data.token;
      const userData = {
        _id: data._id,
        username: data.username,
        email: data.email,
        role: data.role
      };
      
      // Validate token before saving
      if (!token || token.trim() === '' || token.includes(' ')) {
        throw new Error('Invalid token format');
      }
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      console.log('Token saved to localStorage');
      
      // Set user in state
      setUser(userData);
      setError(null);
      
      toast.success('Login successful!');
      return { success: true, user: userData };
    } catch (err) {
      console.error('Login failed:', err);
      
      let errorMessage = 'Login failed. Please try again.';
      
      // Use customMessage from api.js if available
      if (err.customMessage) {
        errorMessage = err.customMessage;
      }
      // Handle different types of errors
      else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check if the server is running and your internet connection is working.';
        toast.error(errorMessage);
      } else if (err.message === 'Login request timed out') {
        errorMessage = 'Login request timed out. Server might be overloaded or unreachable.';
        toast.error(errorMessage);
      } else if (err.response?.data?.message) {
        // Server returned an error message
        errorMessage = err.response.data.message;
        toast.error(errorMessage);
      } else {
        // Generic or client-side error
        errorMessage = err.message || 'Login failed. Please try again.';
        toast.error(errorMessage);
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage, error: err };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Clear user from state
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(userData);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (err) {
      console.error('Profile update failed:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      await authService.changePassword(passwordData);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (err) {
      console.error('Password change failed:', err);
      const errorMessage = err.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await authService.forgotPassword(email);
      toast.success('Password reset instructions sent to your email');
      return { success: true };
    } catch (err) {
      console.error('Forgot password request failed:', err);
      const errorMessage = err.response?.data?.message || 'Failed to process forgot password request';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, passwords) => {
    try {
      setLoading(true);
      await authService.resetPassword(token, passwords);
      toast.success('Password reset successful. You can now login with your new password.');
      return { success: true };
    } catch (err) {
      console.error('Password reset failed:', err);
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};