import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import clientService from '../../services/clientService';

import Loader from '../../components/Loader';
import { FaImage, FaSave, FaTimes } from 'react-icons/fa';
import api from '../../services/api';

const ClientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    website: '',
    industry: '',
    order: 0,
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [errors, setErrors] = useState({});
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchClient();
    }
  }, [id, isEdit]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await clientService.getClient(id);
      const client = response.data.client;
      setFormData({
        name: client.name || '',
        logo: client.logo || '',
        description: client.description || '',
        website: client.website || '',
        industry: client.industry || '',
        order: client.order || 0,
        isActive: client.isActive !== undefined ? client.isActive : true
      });
    } catch (error) {
      console.error('Error fetching client:', error);
      toast.error('Failed to fetch client data');
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const fetchMediaFiles = async (page = 1) => {
    try {
      setIsLoadingMedia(true);
      console.log('Fetching media files for page:', page);
      
      const response = await api.get(`/media?page=${page}&limit=12`);
      console.log('Media API response:', response);
      
      if (response && response.data) {
        let mediaData = [];
        let totalPages = 1;
        let currentPage = page;
        
        if (Array.isArray(response.data)) {
          mediaData = response.data;
        } else if (response.data.media && Array.isArray(response.data.media)) {
          mediaData = response.data.media;
          totalPages = response.data.totalPages || 1;
          currentPage = response.data.currentPage || page;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          mediaData = response.data.data;
          totalPages = response.data.totalPages || Math.ceil((response.data.totalCount || 0) / 12) || 1;
          currentPage = response.data.currentPage || page;
        }
        
        if (mediaData.length > 0) {
          console.log('Successfully parsed media data:', mediaData);
          setMediaFiles(mediaData);
          setTotalMediaPages(totalPages);
          setMediaPage(currentPage);
        } else {
          console.error('No media data found in response:', response);
          toast.error('Failed to parse media data');
          setMediaFiles([]);
        }
      } else {
        console.error('Invalid media response:', response);
        toast.error('Failed to load media files');
        setMediaFiles([]);
      }
    } catch (err) {
      console.error('Media fetch error:', err);
      toast.error('Failed to load media files: ' + (err.message || 'Unknown error'));
      setMediaFiles([]);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleMediaSelect = (media) => {
    console.log('Selected media:', media);
    
    let mediaUrl = null;
    
    if (typeof media === 'string') {
      mediaUrl = media;
    } else if (media.backendUrl) {
      mediaUrl = media.backendUrl;
    } else if (media.fullUrl) {
      mediaUrl = media.fullUrl;
    } else if (media.url) {
      mediaUrl = media.url;
    } else if (media.path) {
      mediaUrl = media.path;
    } else if (media.file && media.file.url) {
      mediaUrl = media.file.url;
    }
    
    if (mediaUrl) {
      console.log('Setting logo URL:', mediaUrl);
      setFormData(prev => ({ ...prev, logo: mediaUrl }));
      toast.success('Logo selected successfully');
    } else {
      console.error('Invalid media object structure:', media);
      toast.error('Could not determine media URL');
    }
    
    setShowMediaLibrary(false);
    if (errors.logo) {
      setErrors(prev => ({ ...prev, logo: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }
    
    if (!formData.logo.trim()) {
      newErrors.logo = 'Client logo is required';
    }
    
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      setSubmitLoading(true);
      
      if (isEdit) {
        await clientService.updateClient(id, formData);
        toast.success('Client updated successfully');
      } else {
        await clientService.createClient(formData);
        toast.success('Client created successfully');
      }
      
      navigate('/clients');
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error(isEdit ? 'Failed to update client' : 'Failed to create client');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Client' : 'Add New Client'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEdit ? 'Update client information' : 'Add a new client to the marquee section'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Client Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter client name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Logo *
            </label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div
                  onClick={() => {
                    setShowMediaLibrary(true);
                    fetchMediaFiles();
                  }}
                  className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    errors.logo
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                  }`}
                >
                  {formData.logo ? (
                    <div className="text-center">
                      <img
                        src={formData.logo}
                        alt="Client logo"
                        className="max-h-20 max-w-20 object-contain mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-600">Click to change logo</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FaImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to select logo</p>
                    </div>
                  )}
                </div>
                {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description about the client"
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.website ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com"
            />
            {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Automotive, Healthcare, Technology"
            />
          </div>

          {/* Order */}
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
            <p className="text-sm text-gray-500 mt-1">
              Lower numbers appear first in the marquee
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active (show in marquee)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaTimes className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {submitLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaSave className="w-4 h-4" />
              )}
              {isEdit ? 'Update Client' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Select Logo</h2>
                <button
                  onClick={() => setShowMediaLibrary(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {isLoadingMedia ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : mediaFiles && mediaFiles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No media files found</p>
                  <button 
                    onClick={() => fetchMediaFiles(1)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Refresh Media
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <button 
                      onClick={() => fetchMediaFiles(1)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Refresh Media
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                      Showing {mediaFiles ? mediaFiles.length : 0} media files
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mediaFiles && mediaFiles.map((media, index) => {
                      const mediaUrl = media.url || media.path || 
                        (media.formats && media.formats.thumbnail ? media.formats.thumbnail.url : null) ||
                        (media.formats && media.formats.small ? media.formats.small.url : null) ||
                        (media.formats && media.formats.medium ? media.formats.medium.url : null) ||
                        (media.formats && media.formats.large ? media.formats.large.url : null);
                        
                      const mediaName = media.name || media.filename || media.title || `Media ${index + 1}`;
                      
                      return (
                        <div 
                          key={media._id || media.id || index} 
                          className="border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                          onClick={() => handleMediaSelect(media.url || media)}
                        >
                          <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                            {mediaUrl ? (
                              <img 
                                src={mediaUrl} 
                                alt={mediaName} 
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  console.log('Image load error for:', mediaUrl);
                                  e.target.onerror = null;
                                  e.target.src = '/placeholder-image.jpg';
                                }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-gray-200">
                                <span className="text-gray-500">No preview</span>
                              </div>
                            )}
                          </div>
                          <div className="p-2 text-sm truncate">
                            {mediaName}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              
              {/* Pagination */}
              {totalMediaPages > 1 && (
                <div className="flex justify-center mt-4">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => fetchMediaFiles(mediaPage - 1)}
                      disabled={mediaPage === 1 || isLoadingMedia}
                      className={`px-3 py-1 rounded ${mediaPage === 1 || isLoadingMedia ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                    >
                      Previous
                    </button>
                    
                    <span className="text-sm text-gray-600">
                      Page {mediaPage} of {totalMediaPages}
                    </span>
                    
                    <button
                      onClick={() => fetchMediaFiles(mediaPage + 1)}
                      disabled={mediaPage === totalMediaPages || isLoadingMedia}
                      className={`px-3 py-1 rounded ${mediaPage === totalMediaPages || isLoadingMedia ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientForm;