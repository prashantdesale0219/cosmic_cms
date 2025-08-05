import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { testimonialService, mediaService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TestimonialForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    quote: '',
    image: '',
    rating: 5,
    projectType: '',
    isActive: true,
    featured: false,
    order: 0
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchTestimonial();
    }
  }, [id, isEdit]);

  const fetchTestimonial = async () => {
    try {
      setFetchLoading(true);
      const response = await testimonialService.getTestimonialById(id);
      if (response.data.success) {
        setFormData(response.data.data);
      } else {
        toast.error('Failed to fetch testimonial');
        navigate('/about/testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      toast.error('Error fetching testimonial');
      navigate('/about/testimonials');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const fetchMediaFiles = async (page = 1) => {
    try {
      setIsLoadingMedia(true);
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
            mediaData = response.data.data;
            totalPages = response.data.totalPages || Math.ceil((response.data.totalCount || 0) / 12) || 1;
            currentPage = response.data.currentPage || page;
          } else if (Array.isArray(response.data)) {
            mediaData = response.data;
          } else if (response.data.media && Array.isArray(response.data.media)) {
            mediaData = response.data.media;
            totalPages = response.data.totalPages || 1;
            currentPage = response.data.currentPage || page;
          }
        } else if (response.data) {
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

  const handleMediaPageChange = (page) => {
    if (page < 1 || page > totalMediaPages || isLoadingMedia) return;
    console.log('Changing media page to:', page);
    fetchMediaFiles(page);
  };

  const handleMediaSelect = (media) => {
    console.log('Selected media:', media);
    
    // Handle different media object structures
    let mediaUrl = null;
    
    // Try to extract URL from various possible structures
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
    } else if (media.formats && media.formats.thumbnail && media.formats.thumbnail.url) {
      mediaUrl = media.formats.thumbnail.url;
    }
    
    if (mediaUrl) {
      console.log('Setting client image URL:', mediaUrl);
      setFormData(prev => ({ ...prev, image: mediaUrl }));
      toast.success('Client image selected successfully');
    } else {
      console.error('Invalid media object structure:', media);
      toast.error('Could not determine media URL');
    }
    
    setShowMediaLibrary(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.quote.trim()) {
      toast.error('Client name and testimonial text are required');
      return;
    }

    try {
      setLoading(true);
      let response;
      
      if (isEdit) {
        response = await testimonialService.updateTestimonial(id, formData);
      } else {
        response = await testimonialService.createTestimonial(formData);
      }

      if (response.data.success) {
        toast.success(`Testimonial ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/about/testimonials');
      } else {
        toast.error(response.data.message || `Failed to ${isEdit ? 'update' : 'create'} testimonial`);
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error(`Error ${isEdit ? 'updating' : 'creating'} testimonial`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/about/testimonials')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Testimonials
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter client position"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter client company"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select project type</option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-app">Mobile App</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="ui-ux-design">UI/UX Design</option>
                  <option value="digital-marketing">Digital Marketing</option>
                  <option value="branding">Branding</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Testimonial Text */}
            <div>
              <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-2">
                Testimonial Text *
              </label>
              <textarea
                id="quote"
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter testimonial text"
              />
            </div>

            {/* Client Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Image
              </label>
              <div className="mt-1 flex items-center">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Client"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowMediaLibrary(true);
                    fetchMediaFiles();
                  }}
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {formData.image ? 'Change' : 'Select'} Image
                </button>
              </div>
            </div>

            {/* Rating and Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter display order"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
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
                  Active
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Featured
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/about/testimonials')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  isEdit ? 'Update Testimonial' : 'Create Testimonial'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Media Library</h2>
                <button
                  onClick={() => setShowMediaLibrary(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
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
                      // Extract media URL from different possible structures
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

export default TestimonialForm;