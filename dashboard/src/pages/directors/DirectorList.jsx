import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSort, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';

const DirectorList = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('order');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchDirectors();
  }, []);

  const fetchDirectors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/director/directors');
      
      // Handle different response formats
      let directorsData = [];
      if (response.data.data && response.data.data.directors) {
        directorsData = response.data.data.directors;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        directorsData = response.data.data;
      } else if (response.data.directors) {
        directorsData = response.data.directors;
      } else if (Array.isArray(response.data)) {
        directorsData = response.data;
      }
      
      setDirectors(directorsData);
    } catch (error) {
      console.error('Error fetching directors:', error);
      toast.error('Failed to fetch directors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this director?')) {
      try {
        await api.delete(`/director/directors/${id}`);
        toast.success('Director deleted successfully');
        fetchDirectors();
      } catch (error) {
        console.error('Error deleting director:', error);
        toast.error('Failed to delete director');
      }
    }
  };

  const filteredDirectors = directors
    .filter(director => 
      director.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      director.position.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Directors Management</h1>
          <p className="text-gray-600 mt-1">Manage director profiles and information</p>
        </div>
        <Link
          to="/directors/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Add Director
        </Link>
      </div>

      {/* Search and Sort */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search directors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="order">Sort by Order</option>
              <option value="name">Sort by Name</option>
              <option value="position">Sort by Position</option>
              <option value="createdAt">Sort by Date</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <FaSort className="w-4 h-4" />
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>
        </div>
      </div>

      {/* Directors Grid */}
      {filteredDirectors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-4">
            <FaEye className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Directors Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No directors match your search criteria.' : 'No directors have been added yet.'}
          </p>
          <Link
            to="/directors/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Add First Director
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDirectors.map((director) => (
            <div key={director._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Director Image */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={director.image || '/placeholder-director.jpg'}
                  alt={director.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-director.jpg';
                  }}
                />
              </div>
              
              {/* Director Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{director.name}</h3>
                    <p className="text-blue-600 font-medium text-sm">{director.position}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    director.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {director.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{director.qualification}</p>
                <p className="text-gray-600 text-sm mb-4">{director.experience}</p>
                
                {/* Message Preview */}
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {director.message.substring(0, 120)}...
                  </p>
                </div>
                
                {/* Social Links Count */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Order: {director.order}</span>
                  <span>{director.socialLinks?.length || 0} Social Links</span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/directors/${director._id}/edit`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                  >
                    <FaEdit className="w-4 h-4 inline mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(director._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectorList;