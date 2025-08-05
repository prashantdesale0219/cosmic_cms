import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaSave, FaArrowLeft, FaImage, FaUpload } from 'react-icons/fa';
import { solarSolutionService } from '../../services/solarSolutionService';
import { mediaService } from '../../services/api';
import Loader from '../../components/Loader';
import MediaLibraryModal from '../../components/MediaLibraryModal';

const SolarSolutionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state using react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      benefits: '',
      implementation: '',
      costSavings: '',
      image: '',
      category: '',
      order: 0,
      isActive: true
    }
  });

  // Component state
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentMediaField, setCurrentMediaField] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Watch form values
  const watchedImage = watch('image');
  const watchedCategory = watch('category');

  // Fetch solar solution data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchSolarSolution = async () => {
        try {
          const response = await solarSolutionService.getSolarSolutionById(id);
          if (response.success && response.data) {
            const solutionData = response.data;
            
            // Set form values
            reset({
              title: solutionData.title || '',
              description: solutionData.description || '',
              benefits: solutionData.benefits || '',
              implementation: solutionData.implementation || '',
              costSavings: solutionData.costSavings || '',
              image: solutionData.image || '',
              category: solutionData.category || '',
              order: solutionData.order || 0,
              isActive: solutionData.isActive !== false // Default to true if not explicitly false
            });
          } else {
            setError('Failed to fetch solar solution data');
            toast.error('Failed to fetch solar solution data');
          }
        } catch (err) {
          console.error('Error fetching solar solution:', err);
          setError('Failed to fetch solar solution data');
          toast.error('Failed to fetch solar solution data');
        } finally {
          setLoading(false);
        }
      };

      fetchSolarSolution();
    }
  }, [id, isEditMode, reset]);

  // Fetch media items
  useEffect(() => {
    const fetchMedia = async () => {
      setLoadingMedia(true);
      try {
        const response = await mediaService.getMedia();
        if (response.success && response.data) {
          setMediaItems(response.data);
        } else {
          console.error('Failed to fetch media items');
        }
      } catch (err) {
        console.error('Error fetching media:', err);
      } finally {
        setLoadingMedia(false);
      }
    };

    if (showMediaLibrary) {
      fetchMedia();
    }
  }, [showMediaLibrary]);

  // Handle form submission
  const onSubmit = async (data) => {
    setSaving(true);
    setError(null);

    try {
      // Prepare data for API
      const solutionData = {
        ...data,
        order: parseInt(data.order, 10) || 0
      };

      let response;
      if (isEditMode) {
        response = await solarSolutionService.updateSolarSolution(id, solutionData);
      } else {
        response = await solarSolutionService.createSolarSolution(solutionData);
      }

      if (response.success) {
        toast.success(
          isEditMode
            ? 'Solar solution updated successfully'
            : 'Solar solution created successfully'
        );
        navigate('/solar-solutions');
      } else {
        setError(response.message || 'Failed to save solar solution');
        toast.error(response.message || 'Failed to save solar solution');
      }
    } catch (err) {
      console.error('Error saving solar solution:', err);
      setError('Failed to save solar solution');
      toast.error('Failed to save solar solution');
    } finally {
      setSaving(false);
    }
  };

  // Handle media selection
  const handleOpenMediaLibrary = (fieldName) => {
    setCurrentMediaField(fieldName);
    setShowMediaLibrary(true);
  };

  // Handle media selection
  const handleMediaSelect = (media) => {
    if (currentMediaField === 'image') {
      setValue('image', media.url);
    } else if (currentMediaField === 'category') {
      setValue('category', media.url);
    }
    setShowMediaLibrary(false);
  };

  // Handle media library close
  const handleCloseMediaLibrary = () => {
    setShowMediaLibrary(false);
    setCurrentMediaField(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Solar Solution' : 'Create Solar Solution'}
        </h1>
        <button
          onClick={() => navigate('/solar-solutions')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to List
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title *
            </label>
            <input
              id="title"
              type="text"
              className={`shadow appearance-none border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              placeholder="Enter title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs italic">{errors.title.message}</p>
            )}
          </div>

          {/* Display Order */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order">
              Display Order
            </label>
            <input
              id="order"
              type="number"
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter display order"
              {...register('order', { valueAsNumber: true })}
            />
          </div>

          {/* Description */}
          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description *
            </label>
            <textarea
              id="description"
              className={`shadow appearance-none border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              placeholder="Enter description"
              rows="4"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="text-red-500 text-xs italic">{errors.description.message}</p>
            )}
          </div>

          {/* Benefits */}
          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="benefits">
              Benefits
            </label>
            <textarea
              id="benefits"
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter benefits"
              rows="4"
              {...register('benefits')}
            />
          </div>

          {/* Implementation */}
          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="implementation">
              Implementation
            </label>
            <textarea
              id="implementation"
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter implementation details"
              rows="4"
              {...register('implementation')}
            />
          </div>

          {/* Cost Savings */}
          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="costSavings">
              Cost Savings
            </label>
            <textarea
              id="costSavings"
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter cost savings information"
              rows="4"
              {...register('costSavings')}
            />
          </div>

          {/* Image */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image
            </label>
            <div className="flex items-center">
              <input
                id="image"
                type="text"
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Image URL"
                {...register('image')}
                readOnly
              />
              <button
                type="button"
                onClick={() => handleOpenMediaLibrary('image')}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
              >
                <FaImage className="mr-2" /> Browse
              </button>
            </div>
            {watchedImage && (
              <div className="mt-2">
                <img
                  src={watchedImage}
                  alt="Selected image"
                  className="max-w-xs max-h-40 object-contain border border-gray-300 rounded p-1"
                />
              </div>
            )}
          </div>

          {/* Icon/Category */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <div className="flex">
              <input
                id="category"
                type="text"
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Category"
                {...register('category')}
                readOnly
              />
              <button
                type="button"
                onClick={() => handleOpenMediaLibrary('category')}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
              >
                <FaImage className="mr-2" /> Browse
              </button>
            </div>
            {watchedCategory && (
              <div className="mt-2">
                <img
                  src={watchedCategory}
                  alt="Selected category"
                  className="max-w-xs max-h-20 object-contain border border-gray-300 rounded p-1"
                />
              </div>
            )}
          </div>

          {/* Active Status */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <div className="flex items-center">
              <input
                id="isActive"
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                {...register('isActive')}
              />
              <label htmlFor="isActive" className="ml-2 text-gray-700">
                Active
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end mt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded flex items-center disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader size="sm" className="mr-2" /> Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" /> Save
              </>
            )}
          </button>
        </div>
      </form>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibraryModal
          isOpen={showMediaLibrary}
          onClose={handleCloseMediaLibrary}
          onSelect={handleMediaSelect}
        />
      )}
    </div>
  );
};

export default SolarSolutionForm;