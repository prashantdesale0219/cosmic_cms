import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import MediaLibraryModal from '../../components/MediaLibraryModal';

const TeamAchievementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      year: new Date().getFullYear(),
      title: '',
      organization: '',
      description: '',
      image: '',
      order: 0,
      isActive: true,
      isFeatured: false
    }
  });
  
  const image = watch('image');

  useEffect(() => {
    if (isEditMode) {
      fetchAchievement();
    }
  }, [id, isEditMode]);

  const fetchAchievement = async () => {
    try {
      setIsFetching(true);
      const response = await api.get(`/team-celebration/achievements/${id}`);
      const achievement = response.data.data;
      
      reset({
        year: achievement.year || new Date().getFullYear(),
        title: achievement.title || '',
        organization: achievement.organization || '',
        description: achievement.description || '',
        image: achievement.image || '',
        order: achievement.order || 0,
        isActive: achievement.isActive ?? true,
        isFeatured: achievement.isFeatured ?? false
      });
    } catch (error) {
      toast.error('Failed to fetch achievement details');
      navigate('/team-celebration/achievements');
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      if (isEditMode) {
        await api.put(`/team-celebration/achievements/${id}`, data);
        toast.success('Achievement updated successfully!');
      } else {
        await api.post('/team-celebration/achievements', data);
        toast.success('Achievement created successfully!');
      }
      
      navigate('/team-celebration/achievements');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaSelect = (media) => {
    setValue('image', media.url);
    setIsMediaModalOpen(false);
  };

  const removeImage = () => {
    setValue('image', '');
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Team Achievement' : 'Create New Team Achievement'}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? 'Update the team achievement details' : 'Add a new team achievement'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Achievement Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter achievement title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <input
                type="number"
                {...register('year', { 
                  required: 'Year is required',
                  valueAsNumber: true,
                  min: { value: 1900, message: 'Year must be after 1900' },
                  max: { value: new Date().getFullYear() + 10, message: 'Year cannot be too far in the future' }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter year"
              />
              {errors.year && (
                <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization *
              </label>
              <input
                type="text"
                {...register('organization', { required: 'Organization is required' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter awarding organization"
              />
              {errors.organization && (
                <p className="text-red-500 text-sm mt-1">{errors.organization.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter achievement description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Achievement Image */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievement Image</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Achievement Image
              </label>
              
              {image ? (
                <div className="relative inline-block">
                  <img
                    src={image}
                    alt="Achievement"
                    className="w-48 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">No image selected</p>
                </div>
              )}
              
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  {...register('image')}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Image URL"
                />
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <PhotoIcon className="h-5 w-5" />
                  Select Media
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                {...register('order', { valueAsNumber: true })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                {...register('isFeatured')}
                className="mr-2"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                Featured
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/team-celebration/achievements')}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Achievement' : 'Create Achievement'}
          </button>
        </div>
      </form>

      {/* Media Library Modal */}
      {isMediaModalOpen && (
        <MediaLibraryModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onSelect={handleMediaSelect}
          acceptedTypes={['image']}
        />
      )}
    </div>
  );
};

export default TeamAchievementForm;