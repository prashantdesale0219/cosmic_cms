import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FiAlertCircle, FiCheckCircle, FiDatabase, FiInfo } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

// Import the checkServerStatus function from api.js
import { checkServerStatus as apiCheckServerStatus, authService } from '../../services/api';

const Register = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password', '');
  
  // Define API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // Function to check server status using the imported function from api.js
  const checkServerStatus = async () => {
    setServerStatus('checking');
    console.log('Checking server status from Register component...');
    
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
        toast.error('Backend server appears to be offline. Registration may not work correctly.');
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

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Basic client-side validation
      if (!data.name || !data.email || !data.password || !data.confirmPassword) {
        setError('All fields are required');
        setIsLoading(false);
        return;
      }
      
      // Check if server is offline before attempting registration
      if (serverStatus === 'offline') {
        toast.error('Server is offline. Please try again later.');
        setError('Server is offline. Registration is currently unavailable.');
        setIsLoading(false);
        return;
      }
      
      // First check if server is online and database is connected
      const serverResult = await checkServerStatus();
      
      // Check if database is connected before attempting registration
      if (serverResult && serverResult.database && !serverResult.database.connected) {
        toast.error('Database connection issue. Registration may not work properly.');
        setError('Database connection issue. Registration may not work properly.');
        setIsLoading(false);
        return;
      }
      
      // Prepare registration data
      const registrationData = {
        username: data.name, // Changed from name to username to match backend expectations
        email: data.email,
        password: data.password,
        role: data.role // Include role selection
      };
      
      // Call the register API with enhanced retry logic
      let retryCount = 0;
      const maxRetries = 7; // Increased from 5 to 7 for more resilience
      let response;
      
      while (retryCount < maxRetries) {
        try {
          console.log(`Attempting registration (attempt ${retryCount + 1}/${maxRetries})`);
          
          // Add a small delay before each retry attempt (except the first one)
          if (retryCount > 0) {
            const waitTime = 3000 * retryCount; // Longer wait time with each retry (3s, 6s, 9s, 12s, 15s, 18s)
            console.log(`Waiting ${waitTime/1000} seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
          
          response = await authService.register(registrationData);
          
          if (response.data && response.data.success) {
            toast.success('Registration successful! You can now log in.');
            navigate('/login');
            return; // Exit the function on success
          } else {
            const errorMessage = response.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
            return; // Exit the function on server response with error
          }
        } catch (err) {
          console.error(`Registration attempt ${retryCount + 1} failed:`, err);
          retryCount++;
          
          // Enhanced network error handling with more detailed diagnostics
          if (err.code === 'ERR_NETWORK' && retryCount < maxRetries) {
            // Network error, wait and retry
            const waitTime = 4000 * retryCount; // Increased wait time with each retry (4s, 8s, 12s, 16s, 20s, 24s)
            console.log(`Network error, retrying in ${waitTime/1000} seconds...`);
            
            // Log more diagnostic information
            console.log('Network error details:', {
              browserInfo: navigator.userAgent,
              connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
              onLine: navigator.onLine,
              timeOfError: new Date().toLocaleString(),
              apiBaseUrl: API_BASE_URL,
              retryAttempt: retryCount + 1
            });
            
            toast.error(`Connection issue. Retrying in ${waitTime/1000} seconds... (Attempt ${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          } else if (retryCount >= maxRetries) {
            // Max retries reached
            setError('Registration failed after multiple attempts. Please check your connection and try again later.');
            toast.error('Registration failed after multiple attempts. Please check your connection and try again later.');
            break;
          } else {
            // Other error, don't retry
            throw err;
          }
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data?.message || 'Registration failed. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please try again later.');
        toast.error('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred. Please try again.');
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register New Admin
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create a new administrator account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Server Status Indicator */}
        {serverStatus === 'checking' && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-center">
              <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 text-yellow-500 mr-2" />
              <p className="text-sm text-yellow-700">Checking server connection...</p>
            </div>
          </div>
        )}
        
        {serverStatus === 'offline' && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Server Connection Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Cannot connect to the backend server. Registration is currently unavailable.</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      type="button"
                      onClick={handleRetryConnection}
                      className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Retry Connection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {serverStatus === 'online' && showOnlineStatus && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Server Connected</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Successfully connected to the backend server.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Database Status Indicator */}
        {dbStatus && dbStatus.status === 'disconnected' && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiDatabase className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Database Connection Issue</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>There is an issue with the database connection. Registration may not work properly.</p>
                  {dbStatus.error && <p className="mt-1 font-mono text-xs">{dbStatus.error}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  {...register('name', { required: 'Username is required' })}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            </div>

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
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  {...register('confirmPassword', { 
                    validate: value => 
                      value === password || 'The passwords do not match'
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  {...register('role', { required: 'Role is required' })}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
                {errors.role && (
                  <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || serverStatus !== 'online'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2" />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;