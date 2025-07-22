import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { testimonialService, mediaService } from '../../services/api';

// Import icons
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TestimonialForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      author: '',
      position: '',
      company: '',
      quote: '',
      rating: 5,
      status: 'active',
      image: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);
  const [mediaLoading, setMediaLoading] = useState(false);
  
  const watchedImage = watch('image');

  useEffect(() => {
    if (isEditMode) {
      fetchTestimonial();
    }
  }, [id]);

  const fetchTestimonial = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await testimonialService.getTestimonial(id);
      
      if (response.success) {
        const testimonial = response.data;
        
        // Set form values
        reset({
          author: testimonial.author || '',
          position: testimonial.position || '',
          company: testimonial.company || '',
          quote: testimonial.quote || '',
          rating: testimonial.rating || 5,
          status: testimonial.status || 'active',
          image: testimonial.image || ''
        });
      } else {
        setError('Failed to fetch testimonial');
        toast.error('Failed to fetch testimonial');
      }
    } catch (err) {
      console.error('Testimonial fetch error:', err);
      setError('An error occurred while fetching the testimonial');
      toast.error('An error occurred while fetching the testimonial');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let response;
      
      if (isEditMode) {
        response = await testimonialService.updateTestimonial(id, data);
      } else {
        response = await testimonialService.createTestimonial(data);
      }
      
      if (response.success) {
        toast.success(`Testimonial ${isEditMode ? 'updated' : 'created'} successfully`);
        navigate('/testimonials');
      } else {
        setError(response.message || `Failed to ${isEditMode ? 'update' : 'create'} testimonial`);
        toast.error(response.message || `Failed to ${isEditMode ? 'update' : 'create'} testimonial`);
      }
    } catch (err) {
      console.error('Testimonial submit error:', err);
      setError(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the testimonial`);
      toast.error(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the testimonial`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMedia = async (page = 1) => {
    try {
      setMediaLoading(true);
      const response = await mediaService.getMediaFiles(page, 12, 'image');
      
      if (response.success) {
        setMediaFiles(response.data.files);
        setTotalMediaPages(response.data.totalPages);
        setMediaPage(response.data.currentPage);
      } else {
        toast.error('Failed to load media files');
      }
    } catch (err) {
      console.error('Media fetch error:', err);
      toast.error('An error occurred while loading media files');
    } finally {
      setMediaLoading(false);
    }
  };

  const handleMediaPageChange = (page) => {
    if (page < 1 || page > totalMediaPages) return;
    setMediaPage(page);
    fetchMedia(page);
  };

  const handleMediaSelect = (file) => {
    setValue('image', file.url);
    setShowMediaLibrary(false);
  };

  const handleOpenMediaLibrary = () => {
    setShowMediaLibrary(true);
    fetchMedia(1);
  };

  const handleRemoveImage = () => {
    setValue('image', '');
  };

  if (isLoading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? 'Edit Testimonial' : 'Add New Testimonial'}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Testimonial Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add details about the person providing the testimonial.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      id="author"
                      className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.author ? 'border-red-300' : ''}`}
                      {...register('author', { required: 'Author name is required' })}
                    />
                    {errors.author && (
                      <p className="mt-2 text-sm text-red-600">{errors.author.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                      Position
                    </label>
                    <input
                      type="text"
                      id="position"
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      {...register('position')}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      {...register('company')}
                    />
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="quote" className="block text-sm font-medium text-gray-700">
                      Quote *
                    </label>
                    <textarea
                      id="quote"
                      rows={4}
                      className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.quote ? 'border-red-300' : ''}`}
                      {...register('quote', { required: 'Quote is required' })}
                    />
                    {errors.quote && (
                      <p className="mt-2 text-sm text-red-600">{errors.quote.message}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <select
                      id="rating"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...register('rating', { valueAsNumber: true })}
                    >
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...register('status')}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Author Image</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload a photo of the testimonial author.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div>
                  {watchedImage ? (
                    <div className="relative">
                      <img
                        src={watchedImage}
                        alt="Author"
                        className="h-32 w-32 object-cover rounded-full"
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
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <button
                            type="button"
                            onClick={handleOpenMediaLibrary}
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Select from Media Library</span>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  )}
                  <input
                    type="hidden"
                    id="image"
                    {...register('image')}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/testimonials')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Update Testimonial' : 'Create Testimonial'}</>
                )}
              </button>
            </div>
          </form>
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Media Library</h3>
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => setShowMediaLibrary(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {mediaLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : mediaFiles.length > 0 ? (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mediaFiles.map((file) => (
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
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${mediaPage === i + 1 ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
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

export default TestimonialForm;