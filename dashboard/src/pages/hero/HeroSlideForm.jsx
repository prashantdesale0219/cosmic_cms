import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { heroService, mediaService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { slugify } from '../../utils/helpers';

// Import icons
import { 
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const HeroSlideForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  
  const { register, handleSubmit, setValue, watch, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      key: '',
      num: '',
      railTitle: '',
      title: ['', ''],
      subtitle: '',
      body: '',
      img: '',
      icon: '',
      order: 0,
      isActive: 'false'
    }
  });
  
  const titleArray = watch('title');
  
  // Watch for image changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'img' && value.img) {
        // No need to set a separate state as we're using watch('img') directly in the UI
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  
  useEffect(() => {
    const fetchSlide = async () => {
      if (!isEditMode) return;
      
      try {
        setIsFetching(true);
        setError(null);
        
        const response = await heroService.getSlideById(id);
        
        if (response.data && response.data.success) {
          const slideData = response.data.data;
          reset({
            key: slideData.key || '',
            num: slideData.num || '',
            railTitle: slideData.railTitle || '',
            title: Array.isArray(slideData.title) ? slideData.title : ['', ''], // Ensure title is an array
            subtitle: slideData.subtitle || '',
            body: slideData.body || '',
            img: slideData.img || '',
            icon: slideData.icon || '',
            order: slideData.order || 0,
            isActive: slideData.isActive?.toString() || 'false'
          });
        } else {
          setError('Failed to load slide data');
          toast.error('Failed to load slide data');
        }
      } catch (err) {
        console.error('Slide fetch error:', err);
        setError('An error occurred while loading slide data');
        toast.error('An error occurred while loading slide data');
      } finally {
        setIsFetching(false);
      }
    };

    fetchSlide();
  }, [id, isEditMode, reset]);

  const fetchMediaFiles = async (page = 1) => {
    try {
      setIsLoadingMedia(true);
      const response = await mediaService.getAllMedia();
      
      if (response.data && response.data.success) {
        setMediaFiles(response.data.data);
        setTotalMediaPages(response.data.pagination?.totalPages || 1);
        setMediaPage(response.data.pagination?.page || 1);
      }
    } catch (err) {
      console.error('Media fetch error:', err);
      toast.error('Failed to load media files');
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleMediaPageChange = (page) => {
    if (page < 1 || page > totalMediaPages) return;
    setMediaPage(page);
    fetchMediaFiles(page);
  };

  const handleMediaSelect = (url) => {
    setValue('img', url);
    setShowMediaLibrary(false);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Convert isActive from string to boolean
      const formattedData = {
        ...data,
        isActive: data.isActive === 'true'
      };
      
      let response;
      
      if (isEditMode) {
        response = await heroService.updateSlide(id, formattedData);
      } else {
        response = await heroService.createSlide(formattedData);
      }
      
      if (response.data && response.data.success) {
        toast.success(isEditMode ? 'Hero slide updated successfully!' : 'Hero slide created successfully!');
        navigate('/hero-slides');
      } else {
        const errorMessage = response.data?.message || 'Failed to save hero slide';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Hero slide save error:', response);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Hero slide save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? 'Edit Hero Slide' : 'Create Hero Slide'}
        </h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="key" className="block text-sm font-medium text-gray-700">
                      Key
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="key"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('key', { required: 'Key is required' })}
                      />
                      {errors.key && (
                        <p className="mt-2 text-sm text-red-600">{errors.key.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="num" className="block text-sm font-medium text-gray-700">
                      Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="num"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('num', { required: 'Number is required' })}
                      />
                      {errors.num && (
                        <p className="mt-2 text-sm text-red-600">{errors.num.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="railTitle" className="block text-sm font-medium text-gray-700">
                      Rail Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="railTitle"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('railTitle', { required: 'Rail Title is required' })}
                      />
                      {errors.railTitle && (
                        <p className="mt-2 text-sm text-red-600">{errors.railTitle.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title (Two Lines Required)
                    </label>
                    <div className="mt-1 space-y-2">
                      <input
                        type="text"
                        id="title-line1"
                        placeholder="Title Line 1"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('title.0', { required: 'First line of title is required' })}
                      />
                      <input
                        type="text"
                        id="title-line2"
                        placeholder="Title Line 2"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('title.1', { required: 'Second line of title is required' })}
                      />
                      {errors.title && (
                        <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                      )}
                      {errors['title.0'] && (
                        <p className="mt-2 text-sm text-red-600">{errors['title.0'].message}</p>
                      )}
                      {errors['title.1'] && (
                        <p className="mt-2 text-sm text-red-600">{errors['title.1'].message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
                      Subtitle
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="subtitle"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('subtitle', { required: 'Subtitle is required' })}
                      />
                      {errors.subtitle && (
                        <p className="mt-2 text-sm text-red-600">{errors.subtitle.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                      Body
                    </label>
                    <div className="mt-1">
                      <Controller
                        name="body"
                        control={control}
                        rules={{ required: 'Body text is required' }}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            className="h-32 mb-12"
                          />
                        )}
                      />
                      {errors.body && (
                        <p className="mt-2 text-sm text-red-600">{errors.body.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Image
                    </label>
                    <div className="mt-1 flex items-center">
                      {watch('img') ? (
                        <div className="relative">
                          <img
                            src={watch('img')}
                            alt="Background"
                            className="h-32 w-64 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => setValue('img', '')}
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setShowMediaLibrary(true);
                            fetchMediaFiles();
                          }}
                          className="h-32 w-64 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
                        >
                          <PhotoIcon className="h-8 w-8" aria-hidden="true" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setShowMediaLibrary(true);
                          fetchMediaFiles();
                        }}
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {watch('img') ? 'Change' : 'Select'} Image
                      </button>
                      <input
                        type="hidden"
                        {...register('img', { required: 'Image is required' })}
                      />
                      {errors.img && (
                        <p className="mt-2 text-sm text-red-600">{errors.img.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                      SVG Icon
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="icon"
                        rows={3}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="<svg>...</svg>"
                        {...register('icon', { required: 'SVG icon is required' })}
                      />
                      {errors.icon && (
                        <p className="mt-2 text-sm text-red-600">{errors.icon.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                      Order
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="order"
                        min="0"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('order', { 
                          valueAsNumber: true
                        })}
                      />
                      {errors.order && (
                        <p className="mt-2 text-sm text-red-600">{errors.order.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1">
                      <select
                        id="isActive"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('isActive')}
                      >
                        <option value="false">Draft</option>
                        <option value="true">Active</option>
                      </select>
                      {errors.isActive && (
                        <p className="mt-2 text-sm text-red-600">{errors.isActive.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/hero-slides')}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      isEditMode ? 'Update Slide' : 'Create Slide'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Media Library
                  </h3>
                  <div className="mt-4">
                    {isLoadingMedia ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {mediaFiles.length > 0 ? (
                            mediaFiles.map((media) => (
                              <div 
                                key={media._id} 
                                onClick={() => handleMediaSelect(media.url)}
                                className="relative group cursor-pointer border border-gray-200 rounded-md overflow-hidden"
                              >
                                <img 
                                  src={media.url} 
                                  alt={media.name} 
                                  className="h-32 w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                                  <span className="text-white opacity-0 group-hover:opacity-100">Select</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                              No media files found
                            </div>
                          )}
                        </div>
                        
                        {totalMediaPages > 1 && (
                          <div className="flex justify-center mt-4 space-x-2">
                            <button
                              onClick={() => handleMediaPageChange(mediaPage - 1)}
                              disabled={mediaPage === 1}
                              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <span className="px-3 py-1 text-sm">
                              Page {mediaPage} of {totalMediaPages}
                            </span>
                            <button
                              onClick={() => handleMediaPageChange(mediaPage + 1)}
                              disabled={mediaPage === totalMediaPages}
                              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
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
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowMediaLibrary(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSlideForm;