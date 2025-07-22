import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FiAlertCircle, FiCheckCircle, FiDatabase, FiInfo } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

// Import the checkServerStatus function from api.js
import { checkServerStatus as apiCheckServerStatus } from '../../services/api';

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Define API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  console.log('API Base URL:', API_BASE_URL);
  
  // Function to check server status using the imported function from api.js
  const checkServerStatus = async () => {
    setServerStatus('checking');
    console.log('Checking server status from Login component...');
    
    try {
      // Use the imported checkServerStatus function
      const result = await apiCheckServerStatus();
      
      if (result.success) {
        console.log(`Server is online (connected to ${result.endpoint})`);
        setServerStatus('online');
        
        // Update database status if available
        if (result && result.database) {
          setDbStatus({
            status: result.database.connected ? 'connected' : 'disconnected',
            error: result.database.error || null
          });
        }
        
        return result;
      } else {
        throw new Error(result.error || 'All connection attempts failed');
      }
    } catch (error) {
      console.error('Server status check failed:', error);
      
      setServerStatus('offline');
      
      // Provide more specific error message based on error type
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to backend server. Please check if the server is running.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Connection to server timed out. Server might be overloaded.');
      } else if (error.message && error.message.includes('aborted')) {
        toast.error('Connection attempt was aborted. Server might be unreachable.');
      } else {
        toast.error('Backend server appears to be offline. Login may not work correctly.');
      }
      
      return false;
    }
  };
  
  // Additional state for database status
  const [dbStatus, setDbStatus] = useState(null);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  
  // Check server status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      setServerStatus('checking');
      try {
        const result = await apiCheckServerStatus();
        setServerStatus('online');
        // Only show online status briefly if there are no database issues
        const hasDbIssues = result && result.database && !result.database.connected;
        setShowOnlineStatus(true);
        if (!hasDbIssues) {
          setTimeout(() => setShowOnlineStatus(false), 5000);
        }
        
        // Update database status if available
        if (result && result.database) {
          setDbStatus({
            status: result.database.connected ? 'connected' : 'disconnected',
            error: result.database.error || null
          });
        }
      } catch (error) {
        console.error('Server status check failed:', error);
        setServerStatus('offline');
      }
    };
    
    checkStatus();
    
    // Set up periodic status check every 30 seconds
    const intervalId = setInterval(checkStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Hide the online status message after 5 seconds
  useEffect(() => {
    let timer;
    if (serverStatus === 'online' && showOnlineStatus) {
      timer = setTimeout(() => {
        setShowOnlineStatus(false);
      }, 5000);
    }
    
    // Reset the flag when server status changes
    if (serverStatus !== 'online') {
      setShowOnlineStatus(true);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [serverStatus, showOnlineStatus]);
  
  // Function to manually retry server connection
  const handleRetryConnection = async () => {
    const loadingToastId = toast.loading('Checking server connection...');
    setServerStatus('checking');
    setError('');
    
    try {
      const result = await apiCheckServerStatus();
      setServerStatus('online');
      setShowOnlineStatus(true);
      
      // Update database status if available
      if (result && result.database) {
        setDbStatus({
          status: result.database.connected ? 'connected' : 'disconnected',
          error: result.database.error || null
        });
      }
      
      // Show appropriate success message
      if (result && result.database && !result.database.connected) {
        toast.success('Connected to server, but database connection has issues!');
      } else {
        toast.success('Connected to server successfully!');
      }
    } catch (error) {
      console.error('Server connection retry failed:', error);
      setServerStatus('offline');
      toast.error('Could not connect to server. Please try again later.');
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  // Function to fill demo credentials when DB is down
  const fillDemoCredentials = () => {
    // Pre-fill the form with demo credentials
    document.getElementById('email').value = 'admin@example.com';
    document.getElementById('password').value = 'admin123';
    
    // Update form state
    const demoData = {
      email: 'admin@example.com',
      password: 'admin123'
    };
    
    // Submit the form with demo credentials
    onSubmit(demoData);
  };
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Basic client-side validation
      if (!data.email || !data.password) {
        setError('Email and password are required');
        return;
      }
      
      // Check if server is offline before attempting login
      if (serverStatus === 'offline') {
        toast.error('Server is offline. Please try again later.');
        setError('Server is offline. Login is currently unavailable.');
        return;
      }
      
      // First check if server is online and database is connected
      const serverResult = await checkServerStatus();
      
      // Check if database is connected before attempting login
      if (serverResult && serverResult.database && !serverResult.database.connected) {
        // Show warning but allow login attempt
        toast.error('Database connection issue detected. Try using demo credentials: admin@example.com / admin123');
        // Suggest demo credentials
        setError('Database connection issue. You can try using demo credentials: admin@example.com / admin123');
        // Don't return here, continue with login attempt
      }
      
      // Try to login even if there are database issues
      const loginResult = await login(data);
      
      // Handle login result
      if (!loginResult.success) {
        // If login failed but it's due to database issues, show a more helpful message
        if (loginResult.message && loginResult.message.includes('database')) {
          setError('Login attempted despite database connection issues. Some features may be limited.');
          toast.error('Logged in with limited functionality due to database issues.');
        } else {
          // For other login failures, show the error message
          setError(loginResult.message || 'Login failed. Please try again.');
        }
        return;
      }
      
      // Set a delay before redirecting to dashboard
      setTimeout(() => {
        // Check if token exists in localStorage before redirecting
        const token = localStorage.getItem('token');
        if (token) {
          navigate('/dashboard');
        } else {
          setError('Authentication failed. Please try again.');
        }
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      
      // Update server status if network error occurs during login
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        setServerStatus('offline');
        toast.error(err.customMessage || 'Server appears to be offline. Please try again later.');
      }
      
      // Use the error from AuthContext if available
      if (err.customMessage) {
        setError(err.customMessage);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message && !err.message.includes('Network Error')) {
        // Only use err.message if it's not the generic 'Network Error'
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Troubleshooting Guide */}
      {serverStatus === 'offline' && (
        <div className="rounded-md bg-blue-50 p-4 mb-4 border border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Troubleshooting Guide</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p className="mb-1">If you're experiencing connection issues, try the following:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Verify the backend server is running</li>
                  <li>Check if MongoDB service is active</li>
                  <li>Ensure your network connection is stable</li>
                  <li>Check if the server URL is correctly configured</li>
                  <li>Contact administrator if issues persist</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Server Status Indicator */}
      {serverStatus === 'checking' ? (
        <div className="rounded-md bg-blue-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Checking Server Connection</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Checking if the backend server is available...</p>
              </div>
            </div>
          </div>
        </div>
      ) : serverStatus === 'offline' ? (
        <div className="rounded-md bg-yellow-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Server Connection Warning</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>The backend server appears to be offline. Login may not work properly.</p>
                <button 
                  type="button" 
                  onClick={handleRetryConnection}
                  className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 flex items-center"
                >
                  <FiInfo className="mr-1" /> Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (serverStatus === 'online' && showOnlineStatus) && (
        <div className="rounded-md bg-green-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Server Connected</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Connected to backend server. You can proceed with login.</p>
                
                {/* Database status indicator */}
                {dbStatus && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <FiDatabase className="mr-1 text-green-600" />
                      <span className="mr-2 font-medium">Database Status:</span>
                      {dbStatus.status === 'connected' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          Connected
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          {dbStatus.status || 'Issue'}
                        </span>
                      )}
                    </div>
                    
                    {dbStatus.error && (
                      <div className="mt-1 text-xs text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-200">
                        <span className="font-medium">Database Error:</span> {dbStatus.error}
                      </div>
                    )}
                    
                    {dbStatus.status !== 'connected' && (
                      <button 
                        type="button" 
                        onClick={handleRetryConnection}
                        className="mt-2 text-xs font-medium text-green-800 hover:text-green-900 flex items-center"
                      >
                        <FiInfo className="mr-1" /> Retry connection
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                {/* Show demo login button if database connection issue */}
                {error.includes('Database connection issue') && (
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiDatabase className="mr-1" /> Use Demo Account
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Register new admin
            </Link>
          </div>
          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || serverStatus === 'offline'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : serverStatus === 'checking' ? (
              'Checking server...' 
            ) : serverStatus === 'offline' ? (
              'Server offline'
            ) : (
              'Sign in'
            )}
          </button>
          
          {serverStatus === 'offline' && (
            <div className="mt-2 text-center">
              <button 
                type="button" 
                onClick={handleRetryConnection}
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Retry connection
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;