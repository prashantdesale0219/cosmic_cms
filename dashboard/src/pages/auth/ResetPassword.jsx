import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';

const ResetPassword = () => {
  const { resetPassword, validateResetToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [tokenChecking, setTokenChecking] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password', '');

  useEffect(() => {
    const checkToken = async () => {
      try {
        const result = await validateResetToken(token);
        if (result.success) {
          setTokenValidated(true);
        } else {
          setError('Invalid or expired password reset token.');
        }
      } catch (err) {
        setError('An error occurred while validating your reset token.');
        console.error('Token validation error:', err);
      } finally {
        setTokenChecking(false);
      }
    };

    if (token) {
      checkToken();
    } else {
      setError('No reset token provided.');
      setTokenChecking(false);
    }
  }, [token, validateResetToken]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('');
      
      const result = await resetPassword(token, data.password);
      
      if (result.success) {
        setMessage('Your password has been reset successfully.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenChecking) {
    return (
      <div className="text-center">
        <svg className="animate-spin h-10 w-10 mx-auto text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-sm text-gray-600">Validating your reset token...</p>
      </div>
    );
  }

  if (!tokenValidated) {
    return (
      <div className="text-center">
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
        <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
          Request a new password reset
        </Link>
      </div>
    );
  }

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        {message && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{message}</h3>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
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
            Confirm New Password
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
                required: 'Please confirm your password',
                validate: value => value === password || 'The passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </div>

        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;