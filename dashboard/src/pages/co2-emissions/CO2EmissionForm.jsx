import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { co2EmissionService, mediaService } from '../../services/co2EmissionService';
import { toast } from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import Modal from 'react-modal';
import 'react-quill/dist/quill.snow.css';

// Set app element for accessibility
Modal.setAppElement('#root');

// Import icons
import { 
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  PencilSquareIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

const CO2EmissionForm = () => {
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
  const [currentImageField, setCurrentImageField] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      icon: '',
      image: '',
      value: '',
      unit: 'tons',
      timeframe: 'per year',
      methodology: '',
      order: 0,
      isActive: true
    }
  });
  
  const icon = watch('icon');
  const image = watch('image');

  useEffect(() => {
    const fetchEmission = async () => {
      if (!isEditMode) return;
      
      try {
        setIsFetching(true);
        setError(null);
        
        console.log('Fetching CO2 emission with ID:', id);
        const response = await co2EmissionService.getEmissionById(id);
        console.log('CO2 emission fetch response:', response);
        
        if (response && response.success) {
          const emissionData = response.data;
          
          reset({
            title: emissionData.title,
            description: emissionData.description,
            icon: emissionData.icon || '',
            image: emissionData.image || '',
            value: emissionData.value,
            unit: emissionData.unit || 'tons',
            timeframe: emissionData.timeframe || 'per year',
            methodology: emissionData.methodology || '',
            order: emissionData.order || 0,
            isActive: emissionData.isActive
          });
        } else {
          const errorMsg = response?.message || 'Failed to load CO2 emission data';
          console.error('CO2 emission fetch error:', errorMsg);
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        console.error('CO2 emission fetch error:', err);
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred while loading CO2 emission data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsFetching(false);
      }
    };

    fetchEmission();
  }, [id, isEditMode, reset]);

  const fetchMediaFiles = async (page = 1) => {
    try {
      setIsLoadingMedia(true);
      console.log('Fetching media files, page:', page);
      const response = await mediaService.getMedia(page, 12);
      console.log('Media fetch response:', response);
      
      if (response && response.data) {
        // Handle the actual API response format
        setMediaFiles(response.data.data || []);
        setTotalMediaPages(Math.ceil((response.data.totalCount || 0) / 12) || 1);
        setMediaPage(page);
        
        if (response.data.data && response.data.data.length === 0) {
          toast.info('No media files found');
        }
      } else {
        const errorMsg = response?.message || 'Failed to load media files';
        console.error('Media fetch error:', errorMsg);
        toast.error(errorMsg);
        // Set empty media files as fallback
        setMediaFiles([]);
        setTotalMediaPages(1);
        setMediaPage(1);
      }
    } catch (err) {
      console.error('Media fetch error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load media files';
      toast.error(errorMessage);
      // Set empty media files as fallback
      setMediaFiles([]);
      setTotalMediaPages(1);
      setMediaPage(1);
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
    console.log('Selected media URL:', url);
    
    if (currentImageField) {
      setValue(currentImageField, url);
      console.log(`Updated ${currentImageField} with:`, url);
    }
    
    // Close the media library modal
    setShowMediaLibrary(false);
    setCurrentImageField(null);
    toast.success('Image selected successfully');
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Debug logs
      console.log('Form data submitted:', data);
      console.log('Edit mode:', isEditMode);
      console.log('CO2 Emission ID:', id);
      
      let response;
      
      if (isEditMode) {
        console.log('Calling updateEmission with ID:', id);
        response = await co2EmissionService.updateEmission(id, data);
        console.log('Update emission response:', response);
      } else {
        console.log('Calling createEmission');
        response = await co2EmissionService.createEmission(data);
        console.log('Create emission response:', response);
      }
      
      if (response && response.success) {
        toast.success(isEditMode ? 'CO2 emission updated successfully' : 'CO2 emission created successfully');
        navigate('/co2-emissions');
      } else {
        console.error('API returned error:', response);
        setError(response?.message || (isEditMode ? 'Failed to update CO2 emission' : 'Failed to create CO2 emission'));
        toast.error(response?.message || (isEditMode ? 'Failed to update CO2 emission' : 'Failed to create CO2 emission'));
      }
    } catch (err) {
      console.error('CO2 emission save error:', err);
      console.error('Error details:', err.response?.data || err.message || err);
      setError(err.response?.data?.message || 'An unexpected error occurred');
      toast.error(err.response?.data?.message || 'An unexpected error occurred');
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
          {isEditMode ? 'Edit CO2 Emission Reduction' : 'Create CO2 Emission Reduction'}
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
                  <div className="sm:col-span-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="title"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('title', { required: 'Title is required' })}
                      />
                      {errors.title && (
                        <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <Controller
                        name="description"
                        control={control}
                        rules={{ required: 'Description is required' }}
                        render={({ field }) => (
                          <div ref={field.ref}>
                            <ReactQuill
                              theme="snow"
                              value={field.value}
                              onChange={field.onChange}
                              className="h-64 mb-12"
                            />
                          </div>
                        )}
                      />
                      {errors.description && (
                        <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                      Value
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="value"
                        step="0.01"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('value', { 
                          required: 'Value is required',
                          valueAsNumber: true
                        })}
                      />
                      {errors.value && (
                        <p className="mt-2 text-sm text-red-600">{errors.value.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                      Unit
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="unit"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('unit', { required: 'Unit is required' })}
                      />
                      {errors.unit && (
                        <p className="mt-2 text-sm text-red-600">{errors.unit.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
                      Timeframe
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="timeframe"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('timeframe', { required: 'Timeframe is required' })}
                      />
                      {errors.timeframe && (
                        <p className="mt-2 text-sm text-red-600">{errors.timeframe.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                      Display Order
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="order"
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

                  <div className="sm:col-span-6">
                    <label htmlFor="methodology" className="block text-sm font-medium text-gray-700">
                      Methodology
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="methodology"
                        rows={3}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        {...register('methodology')}
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Explain how this CO2 emission reduction is calculated or achieved.
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Icon
                    </label>
                    <div className="mt-1 flex items-center">
                      {icon ? (
                        <div className="relative inline-block">
                          <img
                            src={icon}
                            alt="Icon"
                            className="h-16 w-16 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => setValue('icon', '')}
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setCurrentImageField('icon');
                            setShowMediaLibrary(true);
                            fetchMediaFiles();
                          }}
                          className="h-16 w-16 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
                        >
                          <CloudIcon className="h-8 w-8" aria-hidden="true" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentImageField('icon');
                          setShowMediaLibrary(true);
                          fetchMediaFiles();
                        }}
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Image
                    </label>
                    <div className="mt-1 flex items-center">
                      {image ? (
                        <div className="relative inline-block">
                          <img
                            src={image}
                            alt="Image"
                            className="h-16 w-16 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => setValue('image', '')}
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setCurrentImageField('image');
                            setShowMediaLibrary(true);
                            fetchMediaFiles();
                          }}
                          className="h-16 w-16 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
                        >
                          <PhotoIcon className="h-8 w-8" aria-hidden="true" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentImageField('image');
                          setShowMediaLibrary(true);
                          fetchMediaFiles();
                        }}
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <div className="flex items-center">
                      <input
                        id="isActive"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        {...register('isActive')}
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/co2-emissions')}
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
                      isEditMode ? 'Update CO2 Emission' : 'Create CO2 Emission'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Media Library Modal */}
      <Modal
        isOpen={showMediaLibrary}
        onRequestClose={() => {
          setShowMediaLibrary(false);
          setCurrentImageField(null);
        }}
        className="fixed inset-0 z-10 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      >
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Media Library</h3>
                  <div className="mt-4">
                    {isLoadingMedia ? (
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                      </div>
                    ) : (
                      <>
                        {mediaFiles && mediaFiles.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {mediaFiles.map((media) => (
                              <div 
                                key={media._id} 
                                className="cursor-pointer border rounded-md p-2 hover:bg-gray-50"
                                onClick={() => handleMediaSelect(media.url)}
                              >
                                <img 
                                  src={media.url} 
                                  alt={media.name || 'Media'} 
                                  className="h-24 w-full object-cover rounded-md"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-image.png'; // Fallback image
                                  }}
                                />
                                <div className="mt-2 text-xs truncate">{media.name || 'Unnamed'}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <p className="text-gray-500">No media files found</p>
                            <p className="text-sm text-gray-400 mt-2">You can upload new media files from the Media section</p>
                          </div>
                        )}
                        
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
                              {[...Array(totalMediaPages).keys()].map((page) => (
                                <button
                                  key={page + 1}
                                  onClick={() => handleMediaPageChange(page + 1)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${mediaPage === page + 1
                                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                  {page + 1}
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => {
                  setShowMediaLibrary(false);
                  setCurrentImageField(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CO2EmissionForm;