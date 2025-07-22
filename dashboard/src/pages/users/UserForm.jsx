import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [error, setError] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
  const password = watch('password', '');
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!isEditMode) return;
      
      try {
        setIsFetching(true);
        setError(null);
        
        const response = await authService.getUserById(id);
        
        if (response.success) {
          const userData = response.data;
          reset({
            name: userData.name,
            email: userData.email,
            role: userData.role
          });
        } else {
          setError('Failed to load user data');
          toast.error('Failed to load user data');
        }
      } catch (err) {
        console.error('User fetch error:', err);
        setError('An error occurred while loading user data');
        toast.error('An error occurred while loading user data');
      } finally {
        setIsFetching(false);
      }
    };

    fetchUser();
  }, [id, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If password is empty in edit mode, remove it from the data
      if (isEditMode && !data.password) {
        delete data.password;
        delete data.confirmPassword;
      }
      
      let response;
      
      if (isEditMode) {
        response = await authService.updateUser(id, data);
      } else {
        response = await authService.getUsers({ email: data.email });
        
        // Check if user with this email already exists
        if (response.success && response.data.users.length > 0) {
          setError('User with this email already exists');
          toast.error('User with this email already exists');
          setIsLoading(false);
          return;
        }
        
        response = await authService.register(data);
      }
      
      if (response.success) {
        toast.success(isEditMode ? 'User updated successfully' : 'User created successfully');
        navigate('/users');
      } else {
        setError(response.message || (isEditMode ? 'Failed to update user' : 'Failed to create user'));
        toast.error(response.message || (isEditMode ? 'Failed to update user' : 'Failed to create user'));
      }
    } catch (err) {
      console.error('User save error:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? 'Edit User' : 'Create User'}
        </h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      {isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...register('password', { 
                        required: isEditMode ? false : 'Password is required',
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

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      {isEditMode ? 'Confirm New Password' : 'Confirm Password'}
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...register('confirmPassword', { 
                        validate: value => 
                          !password || value === password || 'The passwords do not match'
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      id="role"
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...register('role', { required: 'Role is required' })}
                    >
                      <option value="user">User</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    {errors.role && (
                      <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/users')}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      isEditMode ? 'Update User' : 'Create User'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;