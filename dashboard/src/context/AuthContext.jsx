import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Create axios instance with auth header
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to requests
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setUser(res.data.data || res.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If token is invalid, logout
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
    // The backend returns { success, data: { ...user, token } }
    const token = res.data.data?.token || res.data.token;
    setToken(token);
    localStorage.setItem('token', token);
    setUser(res.data.data || { email });
  };

  const register = async (username, email, password) => {
    const res = await axios.post('http://localhost:5000/api/users/register', { username, email, password });
    // The backend returns { success, data: { ...user, token } }
    const token = res.data.data?.token || res.data.token;
    setToken(token);
    localStorage.setItem('token', token);
    setUser(res.data.data || { username, email });
  };

  const updateProfile = async (userData) => {
    try {
      // Convert name to username for backend
      const backendData = {
        username: userData.name,
        email: userData.email
      };
      
      const res = await api.put('/users/profile', backendData);
      if (res.data.success) {
        setUser(res.data.data);
        return { success: true, message: 'Profile updated successfully' };
      } else {
        return { success: false, message: res.data.message || 'Failed to update profile' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await api.put('/users/change-password', {
        currentPassword,
        newPassword
      });
      if (res.data.success) {
        return { success: true, message: 'Password changed successfully' };
      } else {
        return { success: false, message: res.data.message || 'Failed to change password' };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to change password' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      updateProfile, 
      changePassword,
      fetchUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 