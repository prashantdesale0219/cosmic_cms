import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import mediaService from '../../services/mediaService';

const DirectorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    image: '',
    qualification: '',
    experience: '',
    message: '',
    vision: '',
    socialLinks: [{ platform: 'LinkedIn', url: '' }],
    order: 0,
    isActive: true
  });

  // Media library states
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);

  const socialPlatforms = ['LinkedIn', 'Twitter', 'Email', 'Facebook', 'Instagram'];

  useEffect(() => {
    if (isEdit) {
      fetchDirector();
    }
  }, [id, isEdit]);

  const fetchDirector = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/director/directors/${id}`);
      setFormData(response.data.data.director);
    } catch (error) {
      console.error('Error fetching director:', error);
      toast.error('Failed to fetch director details');
      navigate('/directors');
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
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, socialLinks: updatedLinks }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'LinkedIn', url: '' }]
    }));
  };

  const removeSocialLink = (index) => {
    if (formData.socialLinks.length > 1) {
      const updatedLinks = formData.socialLinks.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, socialLinks: updatedLinks }));
    }
  };

  // Media library functions
  const fetchMediaFiles = async (page = 1) => {
    try {
      setMediaLoading(true);
      console.log('Fetching media files, page:', page);
      const response = await mediaService.getMedia(page, 12);
      
      console.log('Media response:', response);
      
      if (response) {
        let mediaData = [];
        let totalPages = 1;
        let currentPage = page;
        
        // Handle different response structures
        if (response.success && response.data) {
          if (response.data.data && Array.isArray(response.data.data)) {
            // Format: { success: true, data: { data: [...] } }
            mediaData = response.data.data;
            totalPages = response.data.totalPages || Math.ceil((response.data.totalCount || 0) / 12) || 1;
            currentPage = response.data.currentPage || page;
          } else if (Array.isArray(response.data)) {
            // Format: { success: true, data: [...] }
            mediaData = response.data;
          } else if (response.data.media && Array.isArray(response.data.media)) {
            // Format: { success: true, data: { media: [...] } }
            mediaData = response.data.media;
            totalPages = response.data.totalPages || 1;
            currentPage = response.data.currentPage || page;
          }
        } else if (response.data) {
          if (Array.isArray(response.data)) {
            // Format: { data: [...] }
            mediaData = response.data;
          } else if (response.data.media && Array.isArray(response.data.media)) {
            // Format: { data: { media: [...] } }
            mediaData = response.data.media;
            totalPages = response.data.totalPages || 1;
            currentPage = response.data.currentPage || page;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            // Format: { data: { data: [...] } }
            mediaData = response.data.data;
            totalPages = response.data.totalPages || Math.ceil((response.data.totalCount || 0) / 12) || 1;
            currentPage = response.data.currentPage || page;
          }
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
      setMediaLoading(false);
    }
  };

  const handleOpenMediaLibrary = () => {
    setShowMediaLibrary(true);
    fetchMediaFiles(1);
  };

  const handleMediaSelect = (file) => {
    setFormData(prev => ({ ...prev, image: file.url }));
    setShowMediaLibrary(false);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleMediaPageChange = (page) => {
    fetchMediaFiles(page);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Director name is required');
      return;
    }
    if (!formData.position.trim()) {
      toast.error('Director position is required');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Director message is required');
      return;
    }
    if (!formData.vision.trim()) {
      toast.error('Director vision is required');
      return;
    }

    // Validate social links
    const validSocialLinks = formData.socialLinks.filter(link => link.url.trim());
    if (validSocialLinks.length === 0) {
      toast.error('At least one social link is required');
      return;
    }

    try {
      setSaving(true);
      const dataToSubmit = {
        ...formData,
        socialLinks: validSocialLinks
      };

      if (isEdit) {
        await api.patch(`/director/directors/${id}`, dataToSubmit);
        toast.success('Director updated successfully');
      } else {
        await api.post('/director/directors', dataToSubmit);
        toast.success('Director created successfully');
      }
      
      navigate('/directors');
    } catch (error) {
      console.error('Error saving director:', error);
      toast.error(error.response?.data?.message || 'Failed to save director');
    } finally {
      setSaving(false);
    }
  };

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
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/directors')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Director' : 'Add New Director'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update director information' : 'Create a new director profile'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Director Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter director name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Director & Head - Operations"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image *
                </label>
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Director Profile"
                      className="h-48 w-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <button
                          type="button"
                          onClick={handleOpenMediaLibrary}
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Select from Media Library</span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification *
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., MBA (Operations), B.Tech"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience *
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 15+ years in Operations Management"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
              <button
                type="button"
                onClick={addSocialLink}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
              >
                <FaPlus className="w-3 h-3" />
                Add Link
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.socialLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={link.platform}
                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {socialPlatforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    placeholder="Enter URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.socialLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message and Vision */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Message & Vision</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Director Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter director's detailed message..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be displayed in the modal when users click "Read Full Message"
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vision Statement *
              </label>
              <textarea
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter director's vision statement..."
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/directors')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave className="w-4 h-4" />
            {saving ? 'Saving...' : (isEdit ? 'Update Director' : 'Create Director')}
          </button>
        </div>
      </form>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Media Library</h3>
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowMediaLibrary(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {mediaLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : mediaFiles && mediaFiles.length > 0 ? (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {(mediaFiles || []).map((file) => (
                      <div
                        key={file._id}
                        className="relative group cursor-pointer border rounded-md overflow-hidden"
                        onClick={() => handleMediaSelect(file)}
                      >
                        <img
                          src={file.url}
                          alt={file.name}
                          className="h-32 w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 font-medium">Select</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalMediaPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handleMediaPageChange(mediaPage - 1)}
                          disabled={mediaPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {[...Array(totalMediaPages)].map((_, i) => (
                          <button
                            key={i}
                                            onClick={() => handleMediaPageChange(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${mediaPage === i + 1 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handleMediaPageChange(mediaPage + 1)}
                          disabled={mediaPage === totalMediaPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No media files found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload media files from the Media section.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorForm;