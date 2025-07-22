import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { energySolutionService } from '../../services/energySolutionService';
import { mediaService } from '../../services/api';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Modal from '../../components/Modal';

const EnergySolutionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      benefits: '',
      implementation: '',
      costSavings: '',
      image: '',
      icon: '',
      displayOrder: 0,
      active: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'icon'
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaPage, setMediaPage] = useState(1);
  const [mediaTotalPages, setMediaTotalPages] = useState(1);

  const watchImage = watch('image');
  const watchIcon = watch('icon');

  useEffect(() => {
    if (isEditMode) {
      fetchEnergySolution();
    }
  }, [id]);

  const fetchEnergySolution = async () => {
    setLoading(true);
    try {
      const response = await energySolutionService.getEnergySolutionById(id);
      const solution = response.data;
      
      // Set form values
      setValue('title', solution.title);
      setValue('description', solution.description || '');
      setValue('benefits', solution.benefits || '');
      setValue('implementation', solution.implementation || '');
      setValue('costSavings', solution.costSavings || '');
      setValue('image', solution.image || '');
      setValue('icon', solution.icon || '');
      setValue('displayOrder', solution.displayOrder || 0);
      setValue('active', solution.active !== undefined ? solution.active : true);
      
    } catch (err) {
      console.error('Error fetching energy solution:', err);
      setError('Failed to fetch energy solution details');
      toast.error('Failed to load energy solution details');
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaFiles = async (page = 1) => {
    setMediaLoading(true);
    try {
      const response = await mediaService.getMedia(page);
      setMediaFiles(response.data);
      setMediaPage(response.currentPage || page);
      setMediaTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Error fetching media files:', err);
      toast.error('Failed to load media files');
    } finally {
      setMediaLoading(false);
    }
  };

  const handleMediaPageChange = (page) => {
    setMediaPage(page);
    fetchMediaFiles(page);
  };

  const openMediaLibrary = (type) => {
    setMediaType(type);
    setShowMediaLibrary(true);
    fetchMediaFiles();
  };

  const selectMedia = (file) => {
    if (mediaType === 'image') {
      setValue('image', file.url);
    } else if (mediaType === 'icon') {
      setValue('icon', file.url);
    }
    setShowMediaLibrary(false);
  };

  const removeMedia = (type) => {
    if (type === 'image') {
      setValue('image', '');
    } else if (type === 'icon') {
      setValue('icon', '');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isEditMode) {
        await energySolutionService.updateEnergySolution(id, data);
        toast.success('Energy solution updated successfully');
      } else {
        await energySolutionService.createEnergySolution(data);
        toast.success('Energy solution created successfully');
      }
      navigate('/dashboard/energy-solutions');
    } catch (err) {
      console.error('Error saving energy solution:', err);
      setError('Failed to save energy solution');
      toast.error('Failed to save energy solution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Energy Solution' : 'Create Energy Solution'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
              Title *
            </label>
            <input
              type="text"
              id="title"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
              Description *
            </label>
            <ReactQuill
              theme="snow"
              value={watch('description')}
              onChange={(content) => setValue('description', content)}
              className={`bg-white ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Benefits */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="benefits">
              Benefits
            </label>
            <ReactQuill
              theme="snow"
              value={watch('benefits')}
              onChange={(content) => setValue('benefits', content)}
              className="bg-white"
            />
          </div>

          {/* Implementation */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="implementation">
              Implementation
            </label>
            <ReactQuill
              theme="snow"
              value={watch('implementation')}
              onChange={(content) => setValue('implementation', content)}
              className="bg-white"
            />
          </div>

          {/* Cost Savings */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="costSavings">
              Cost Savings
            </label>
            <ReactQuill
              theme="snow"
              value={watch('costSavings')}
              onChange={(content) => setValue('costSavings', content)}
              className="bg-white"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Image
            </label>
            <div className="mb-4">
              {watchImage ? (
                <div className="relative inline-block">
                  <img
                    src={watchImage}
                    alt="Solution Image"
                    className="h-32 w-32 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia('image')}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => openMediaLibrary('image')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Select Image
            </button>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Icon
            </label>
            <div className="mb-4">
              {watchIcon ? (
                <div className="relative inline-block">
                  <img
                    src={watchIcon}
                    alt="Solution Icon"
                    className="h-16 w-16 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia('icon')}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="h-16 w-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">No icon</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => openMediaLibrary('icon')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Select Icon
            </button>
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="displayOrder">
              Display Order
            </label>
            <input
              type="number"
              id="displayOrder"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('displayOrder', { valueAsNumber: true })}
            />
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                {...register('active')}
              />
              <span className="text-gray-700 font-medium">Active</span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/energy-solutions')}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isEditMode ? 'Update Solution' : 'Create Solution'}
          </button>
        </div>
      </form>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <Modal
          title="Media Library"
          onClose={() => setShowMediaLibrary(false)}
          size="large"
        >
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaLoading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : mediaFiles.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No media files found
                </div>
              ) : (
                mediaFiles.map((file) => (
                  <div
                    key={file._id}
                    onClick={() => selectMedia(file)}
                    className="cursor-pointer border rounded-md overflow-hidden hover:border-blue-500 transition-colors duration-200"
                  >
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-2 text-xs truncate">{file.name}</div>
                  </div>
                ))
              )}
            </div>

            {mediaTotalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center">
                  <button
                    onClick={() => handleMediaPageChange(mediaPage - 1)}
                    disabled={mediaPage === 1}
                    className="px-3 py-1 rounded-md mr-2 bg-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">
                    Page {mediaPage} of {mediaTotalPages}
                  </span>
                  <button
                    onClick={() => handleMediaPageChange(mediaPage + 1)}
                    disabled={mediaPage === mediaTotalPages}
                    className="px-3 py-1 rounded-md ml-2 bg-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EnergySolutionForm;