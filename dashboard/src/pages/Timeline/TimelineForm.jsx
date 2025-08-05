import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaImage, FaUpload, FaTimes } from 'react-icons/fa';
import timelineService from '../../services/timelineService';
import mediaService from '../../services/mediaService';
import Loader from '../../components/Loader';

const TimelineForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    backgroundImage: '',
    order: 0,
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);
  const [selectedImagePreview, setSelectedImagePreview] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchTimelineItem();
    }
  }, [id, isEdit]);

  const fetchTimelineItem = async () => {
    try {
      setLoading(true);
      const response = await timelineService.getTimelineItem(id);
      const item = response.data.data.timelineItem;
      setFormData({
        year: item.year || '',
        title: item.title || '',
        description: item.description || '',
        backgroundImage: item.backgroundImage || '',
        order: item.order || 0,
        isActive: item.isActive !== undefined ? item.isActive : true
      });
      setSelectedImagePreview(item.backgroundImage || '');
    } catch (error) {
      console.error('Error fetching timeline item:', error);
      toast.error('Failed to fetch timeline item');
      navigate('/timeline');
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaFiles = async (page = 1) => {
    try {
      setIsLoadingMedia(true);
      const response = await mediaService.getMedia(page, 12);
      
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
          setMediaFiles(mediaData);
          setTotalMediaPages(totalPages);
          setMediaPage(currentPage);
        } else {
          toast.error('Failed to parse media data');
          setMediaFiles([]);
        }
      } else {
        toast.error('Failed to load media files');
        setMediaFiles([]);
      }
    } catch (err) {
      toast.error('Failed to load media files: ' + (err.message || 'Unknown error'));
      setMediaFiles([]);
    } finally {
      setMediaLoading(false);
    }
  };

  // Use fetchMediaFiles directly for pagination
  const handleMediaPageChange = (page) => {
    if (page < 1 || page > totalMediaPages || isLoadingMedia) return;
    fetchMediaFiles(page);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.year || !formData.title || !formData.description || !formData.backgroundImage) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitLoading(true);
      
      if (isEdit) {
        await timelineService.updateTimelineItem(id, formData);
        toast.success('Timeline item updated successfully');
      } else {
        await timelineService.createTimelineItem(formData);
        toast.success('Timeline item created successfully');
      }
      
      navigate('/timeline');
    } catch (error) {
      console.error('Error saving timeline item:', error);
      toast.error(error.response?.data?.message || 'Failed to save timeline item');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleMediaSelect = (media) => {
    const imageUrl = media.fullUrl || media.url || `http://localhost:5000${media.url}` || media.backendUrl || media.path;
    setFormData(prev => ({ ...prev, backgroundImage: imageUrl }));
    setSelectedImagePreview(imageUrl);
    setShowMediaLibrary(false);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, backgroundImage: '' }));
    setSelectedImagePreview('');
  };

  const openMediaLibrary = () => {
    setShowMediaLibrary(true);
    if (mediaFiles.length === 0) {
      fetchMediaFiles(1);
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Timeline Item' : 'Create Timeline Item'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update timeline item details' : 'Add a new milestone to your company timeline'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2023"
                required
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Title */}
          <div className="mt-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter timeline title"
              required
            />
          </div>

          {/* Description */}
          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter timeline description"
              required
            />
          </div>

          {/* Background Image */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image *
            </label>
            
            {selectedImagePreview ? (
              <div className="relative inline-block">
                <img
                  src={selectedImagePreview}
                  alt="Selected background"
                  className="w-48 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <div
                onClick={openMediaLibrary}
                className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <FaImage className="text-gray-400 text-2xl mb-2" />
                <span className="text-gray-500 text-sm">Click to select image</span>
              </div>
            )}
            
            {selectedImagePreview && (
              <button
                type="button"
                onClick={openMediaLibrary}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <FaImage /> Change Image
              </button>
            )}
          </div>

          {/* Status */}
          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/timeline')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {submitLoading && <Loader size="sm" />}
              {isEdit ? 'Update' : 'Create'} Timeline Item
            </button>
          </div>
        </form>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Select Background Image</h3>
              <button
                onClick={() => setShowMediaLibrary(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {isLoadingMedia && mediaFiles.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                  <Loader />
                </div>
              ) : (
                <>
                  {mediaFiles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No media files found
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mediaFiles.map((media) => {
                      const imageUrl = media.fullUrl || media.url || `http://localhost:5000${media.url}` || media.backendUrl || media.path;
                      return (
                        <div
                          key={media._id}
                          onClick={() => handleMediaSelect(media)}
                          className="cursor-pointer group relative overflow-hidden rounded-lg border hover:border-blue-400 transition-colors"
                        >
                          <img
                            src={imageUrl}
                            alt={media.originalName || 'Media'}
                            className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150x100?text=No+Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                        </div>
                      );
                    })}
                    </div>
                   )}
                  
                  {/* Pagination Controls */}
                  {totalMediaPages > 1 && (
                    <div className="mt-4 flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleMediaPageChange(mediaPage - 1)}
                        disabled={mediaPage <= 1 || isLoadingMedia}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      <span className="px-3 py-1 text-sm text-gray-600">
                        Page {mediaPage} of {totalMediaPages}
                      </span>
                      
                      <button
                        onClick={() => handleMediaPageChange(mediaPage + 1)}
                        disabled={mediaPage >= totalMediaPages || isLoadingMedia}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineForm;