import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Register button clicked', { username, email, password });
    try {
      await register(username, email, password);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      console.error('Register error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Register</h2>
        {error && <div className="mb-4 text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
        <div className="mb-4">
          <label className="block mb-2 text-black font-medium">Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-black font-medium">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" 
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-black font-medium">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black" 
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium" 
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div className="mt-4 text-center">
          <a href="/auth/login" className="text-green-600 hover:text-green-700 hover:underline transition-colors duration-300">Already have an account? Login</a>
        </div>
      </form>
    </div>
  );
};

export default Register;