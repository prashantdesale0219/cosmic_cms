import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  const { register: profileRegister, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm();
  const { register: passwordRegister, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword, watch } = useForm();
  
  const newPassword = watch('newPassword', '');

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (data) => {
    try {
      setIsProfileLoading(true);
      const result = await updateProfile(data);
      
      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error('Profile update error:', err);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setIsPasswordLoading(true);
      const result = await changePassword(data.currentPassword, data.newPassword);
      
      if (result.success) {
        toast.success('Password changed successfully');
        resetPassword();
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error('Password change error:', err);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your account details</p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...profileRegister('name', { required: 'Name is required' })}
                    />
                    {profileErrors.name && (
                      <p className="mt-2 text-sm text-red-600">{profileErrors.name.message}</p>
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
                      {...profileRegister('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {profileErrors.email && (
                      <p className="mt-2 text-sm text-red-600">{profileErrors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isProfileLoading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProfileLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your password</p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...passwordRegister('currentPassword', { required: 'Current password is required' })}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-2 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...passwordRegister('newPassword', { 
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-2 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...passwordRegister('confirmPassword', { 
                        required: 'Please confirm your new password',
                        validate: value => value === newPassword || 'The passwords do not match'
                      })}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isPasswordLoading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPasswordLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Changing Password...
                      </>
                    ) : (
                      'Change Password'
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

export default Profile;