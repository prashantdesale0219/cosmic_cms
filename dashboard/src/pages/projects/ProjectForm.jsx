import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, mediaService, categoryService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { slugify } from '../../utils/helpers';
import MediaLibraryModal from '../../components/MediaLibraryModal';

// Import icons
import { 
  PhotoIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const ProjectForm = () => {
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
  const [currentMediaField, setCurrentMediaField] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      client: '',
      location: '',
      completionDate: '',
      coverImage: '', // Added coverImage field
      category: '', // Added category field
      gallery: [],
      status: 'draft',
      featured: false,
      scope: '',
      challenge: '',
      solution: '',
      results: '',
      testimonial: {
        quote: '',
        author: '',
        position: ''
      },
      seo: {
        title: '',
        description: '',
        keywords: ''
      }
    }
  });
  
  const title = watch('title');
  const image = watch('image');
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!isEditMode) return;
      
      try {
        setIsFetching(true);
        setError(null);
        
        const response = await projectService.getProjectById(id);
        
        if (response.success) {
          const projectData = response.data;
          reset({
            title: projectData.title,
            slug: projectData.slug,
            description: projectData.description,
            client: projectData.client || '',
            location: projectData.location || '',
            completionDate: projectData.completionDate ? new Date(projectData.completionDate).toISOString().split('T')[0] : '',
            image: projectData.image || '',
            coverImage: projectData.coverImage || '',
            category: projectData.category || '',
            gallery: projectData.gallery || [],
            status: projectData.status || 'draft',
            featured: projectData.featured || false,
            scope: projectData.scope || '',
            challenge: projectData.challenge || '',
            solution: projectData.solution || '',
            results: projectData.results || '',
            testimonial: {
              quote: projectData.testimonial?.quote || '',
              author: projectData.testimonial?.author || '',
              position: projectData.testimonial?.position || ''
            },
            seo: {
              title: projectData.seo?.title || '',
              description: projectData.seo?.description || '',
              keywords: projectData.seo?.keywords || ''
            }
          });
          
          setGalleryImages(projectData.gallery || []);
        } else {
          setError('Failed to load project data');
          toast.error('Failed to load project data');
        }
      } catch (err) {
        console.error('Project fetch error:', err);
        setError('An error occurred while loading project data');
        toast.error('An error occurred while loading project data');
      } finally {
        setIsFetching(false);
      }
    };

    fetchProject();
  }, [id, isEditMode, reset]);

  useEffect(() => {
    if (title && !isEditMode) {
      setValue('slug', slugify(title));
    }
  }, [title, setValue, isEditMode]);
  
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      console.log('Fetching categories for project form');
      const response = await categoryService.getAllCategories();
      console.log('Categories fetch response:', response);
      
      // The updated categoryService.getAllCategories now returns a consistent format
      // with success flag and data property containing the categories array
      if (response && response.success && Array.isArray(response.data)) {
        console.log('Categories fetch successful with new format');
        setCategories(response.data);
      } else {
        console.error('Invalid categories response format:', response);
        toast.error(response?.message || 'Failed to load categories');
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
      toast.error(err.message || 'Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchMediaFiles = async (page = 1) => {
    try {
      setIsLoadingMedia(true);
      console.log('Fetching media files for project form, page:', page);
      const response = await mediaService.getMedia(page, 12);
      console.log('Media fetch response in project form:', response);
      
      if (response && response.success && response.data) {
        // Handle the actual API response format
        // In the updated mediaService.getMedia, media items are in response.data.data
        const mediaData = response.data.data || [];
        console.log('Media data in project form:', mediaData);
        
        // Ensure each media item has a valid URL
        const processedMedia = mediaData.map(media => {
          console.log('Processing media item:', media);
          
          // Handle different media object structures
          let url = '';
          
          // Try to extract URL from various possible structures
          if (media.url) {
            url = media.url;
          } else if (media.path) {
            url = media.path;
          } else if (media.file && media.file.url) {
            url = media.file.url;
          } else if (media.file && media.file.path) {
            url = media.file.path;
          } else if (media.src) {
            url = media.src;
          } else if (media.source) {
            url = media.source;
          } else if (media.link) {
            url = media.link;
          } else if (typeof media === 'string') {
            url = media;
          }
          
          console.log('Extracted URL:', url);
          
          // Create a new object with the extracted URL
          const processedItem = {
            ...media,
            url: url
          };
          
          // Make sure fullUrl is set, or construct it from url if needed
          if (!processedItem.fullUrl && processedItem.url) {
            // If url is a relative path, convert to absolute
            if (processedItem.url.startsWith('/')) {
              // Try both the frontend origin and backend origin
              const frontendBaseUrl = window.location.origin;
              const backendBaseUrl = 'http://localhost:5000';
              
              // Set fullUrl to frontend URL
              processedItem.fullUrl = `${frontendBaseUrl}${processedItem.url}`;
              // Also store the backend URL as a backup
              processedItem.backendUrl = `${backendBaseUrl}${processedItem.url}`;
              
              console.log('Created URLs for relative path:', {
                frontend: processedItem.fullUrl,
                backend: processedItem.backendUrl
              });
            } else if (!processedItem.url.startsWith('http')) {
              // If it's not an absolute URL already, assume it's relative to backend
              const frontendBaseUrl = window.location.origin;
              const backendBaseUrl = 'http://localhost:5000';
              
              // Set fullUrl to frontend URL
              processedItem.fullUrl = `${frontendBaseUrl}${processedItem.url.startsWith('/') ? '' : '/'}${processedItem.url}`;
              // Also store the backend URL as a backup
              processedItem.backendUrl = `${backendBaseUrl}${processedItem.url.startsWith('/') ? '' : '/'}${processedItem.url}`;
              
              console.log('Created URLs for non-http path:', {
                frontend: processedItem.fullUrl,
                backend: processedItem.backendUrl
              });
            } else {
              processedItem.fullUrl = processedItem.url;
              console.log('Using existing URL as fullUrl:', processedItem.fullUrl);
            }
          } else if (processedItem.fullUrl) {
            // If fullUrl exists but might be using the wrong origin
            if (processedItem.fullUrl.includes('/uploads/')) {
              const uploadPath = processedItem.fullUrl.split('/uploads/')[1];
              processedItem.backendUrl = `http://localhost:5000/uploads/${uploadPath}`;
              console.log('Created backup URL from existing fullUrl:', processedItem.backendUrl);
            }
          }
          return processedItem;
        });
        
        setMediaFiles(processedMedia);
        setTotalMediaPages(response.data.totalPages || Math.ceil((response.data.totalCount || 0) / 12) || 1);
        setMediaPage(response.data.currentPage || page);
      } else {
        console.error('Invalid media response format:', response);
        toast.error('Failed to load media files');
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

  const handleMediaSelect = (media) => {
    console.log('Media selected in ProjectForm:', media);
    
    // Check if media is an object (from MediaLibraryModal) or just a URL string
    let mediaUrl;
    let backupUrl;
    
    if (typeof media === 'object') {
      // Extract URL from various possible structures
      if (media.backendUrl) {
        mediaUrl = media.backendUrl;
        backupUrl = media.fullUrl || media.url;
      } else if (media.fullUrl) {
        mediaUrl = media.fullUrl;
        backupUrl = media.url;
      } else if (media.url) {
        mediaUrl = media.url;
      } else if (media.path) {
        mediaUrl = media.path;
      } else if (media.file && media.file.url) {
        mediaUrl = media.file.url;
      } else if (media.file && media.file.path) {
        mediaUrl = media.file.path;
      } else if (media.src) {
        mediaUrl = media.src;
      } else if (media.source) {
        mediaUrl = media.source;
      } else if (media.link) {
        mediaUrl = media.link;
      } else {
        // If we can't find a URL, log an error and use an empty string
        console.error('Could not extract URL from media object:', media);
        mediaUrl = '';
        toast.error('Could not extract URL from selected media');
        return; // Exit early if we can't find a URL
      }
      
      console.log('Media object URLs:', {
        primary: mediaUrl,
        backup: backupUrl || ''
      });
    } else {
      mediaUrl = media;
      console.log('Using string media URL:', mediaUrl);
    }
    
    // Validate the URL
    if (!mediaUrl) {
      console.error('Empty media URL');
      toast.error('Selected media has no URL');
      return;
    }
    
    // Store both URLs in a data attribute for potential fallback in the UI
    const mediaUrlWithBackup = {
      primary: mediaUrl,
      backup: backupUrl || ''
    };
    
    if (currentMediaField === 'image') {
      setValue('image', mediaUrl);
      setValue('coverImage', mediaUrl); // Also set coverImage when image is selected
      console.log('Set image and coverImage to:', mediaUrl);
      toast.success('Featured image selected successfully');
    } else if (currentMediaField === 'gallery') {
      const newGalleryImages = [...galleryImages, mediaUrl];
      setGalleryImages(newGalleryImages);
      setValue('gallery', newGalleryImages);
      console.log('Added to gallery images:', mediaUrl);
      console.log('New gallery images:', newGalleryImages);
      toast.success('Image added to gallery successfully');
    }
    setShowMediaLibrary(false);
    setCurrentMediaField(null);
  };

  const handleRemoveGalleryImage = (index) => {
    const newGalleryImages = [...galleryImages];
    newGalleryImages.splice(index, 1);
    setGalleryImages(newGalleryImages);
    setValue('gallery', newGalleryImages);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Debug log to see what data is being submitted
      console.log('Submitting project data:', data);
      
      // Ensure gallery is set
      data.gallery = galleryImages;
      
      // Map image to coverImage and ensure it's set
      if (!data.image) {
        setError('Cover image is required');
        toast.error('Cover image is required');
        setIsLoading(false);
        return;
      }
      
      data.coverImage = data.image;
      
      // Ensure required fields are set
      const requiredFields = ['title', 'slug', 'client', 'location', 'completionDate', 'category', 'description'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      // Special check for category field
      if (data.category === '') {
        data.category = 'residential'; // Set a default category if empty
        console.log('Setting default category to residential');
      }
      
      // Log missing fields for debugging
      if (missingFields.length > 0) {
        console.log('Missing fields detected:', missingFields);
        console.log('Current data state:', data);
        const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }
      
      // Format date properly for API
      if (data.completionDate) {
        // Ensure it's in ISO format
        const date = new Date(data.completionDate);
        if (!isNaN(date.getTime())) {
          data.completionDate = date.toISOString();
        }
      }
      
      // Create a clean copy of the data to send to the API
      const apiData = { ...data };
      
      // Log the final data being sent to the API
      console.log('Final data being sent to API:', apiData);
      
      let response;
      
      if (isEditMode) {
        console.log(`Updating project with ID: ${id}`);
        response = await projectService.updateProject(id, apiData);
        console.log('Project update response:', response);
      } else {
        console.log('Creating new project');
        response = await projectService.createProject(apiData);
        console.log('Project creation response:', response);
      }
      
      // Enhanced response checking
      console.log('Processing response for success check:', response);
      
      // First check if response exists and has a success flag
      if (response && response.success === true) {
        console.log('Response has success=true flag, treating as success');
        toast.success(isEditMode ? 'Project updated successfully' : 'Project created successfully');
        setTimeout(() => navigate('/projects'), 500);
        return;
      }
      
      // Check if response has data with success flag
      if (response && response.data && response.data.success === true) {
        console.log('Response.data has success=true flag, treating as success');
        toast.success(isEditMode ? 'Project updated successfully' : 'Project created successfully');
        setTimeout(() => navigate('/projects'), 500);
        return;
      }
      
      // Check if response has HTTP success status
      if (response && (response.status === 200 || response.status === 201)) {
        console.log(`Response has HTTP success status ${response.status}, treating as success`);
        toast.success(isEditMode ? 'Project updated successfully' : 'Project created successfully');
        setTimeout(() => navigate('/projects'), 500);
        return;
      }
      
      // Check if response or response.data has an _id (indicating successful DB save)
      if (response && (response._id || (response.data && response.data._id))) {
        console.log('Response contains _id, treating as success');
        toast.success(isEditMode ? 'Project updated successfully' : 'Project created successfully');
        setTimeout(() => navigate('/projects'), 500);
        return;
      }
      
      // Check if response looks like a project object
      if (response && typeof response === 'object' && response.title && response.slug) {
        console.log('Response appears to be a valid project object, treating as success');
        toast.success(isEditMode ? 'Project updated successfully' : 'Project created successfully');
        setTimeout(() => navigate('/projects'), 500);
        return;
      }
      
      // If we get here, the response doesn't indicate success
      console.error('Project save response error:', response);
      const errorMsg = response?.message || 
                       response?.error || 
                       (isEditMode ? 'Failed to update project' : 'Failed to create project');
      setError(errorMsg);
      toast.error(errorMsg);
    } catch (err) {
      console.error('Project save error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
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
          {isEditMode ? 'Edit Project' : 'Create Project'}
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
                      Project Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="title"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('title', { required: 'Project title is required' })}
                      />
                      {errors.title && (
                        <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                      Slug
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="slug"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('slug', { required: 'Slug is required' })}
                      />
                      {errors.slug && (
                        <p className="mt-2 text-sm text-red-600">{errors.slug.message}</p>
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
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            className="h-64 mb-12"
                          />
                        )}
                      />
                      {errors.description && (
                        <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                      Client
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="client"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('client')}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="location"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('location')}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700">
                      Completion Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        id="completionDate"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('completionDate')}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1">
                      <select
                        id="status"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('status', { required: 'Status is required' })}
                      >
                        <option value="draft">Draft</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                      {errors.status && (
                        <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="mt-1">
                      <select
                        id="category"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('category', { 
                          required: 'Category is required',
                          validate: value => value !== '' || 'Please select a category' 
                        })}
                        defaultValue="residential"
                      >
                        <option value="">Select a category</option>
                        {isLoadingCategories ? (
                          <option value="" disabled>Loading categories...</option>
                        ) : categories && categories.length > 0 ? (
                          categories.map((category) => (
                            <option key={category._id || category.id} value={category.slug || category._id || category.id}>
                              {category.name}
                            </option>
                          ))
                        ) : (
                          // Fallback options if no categories are loaded
                          <>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="industrial">Industrial</option>
                            <option value="utility">Utility</option>
                          </>
                        )}
                      </select>
                      {errors.category && (
                        <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </div>
                  </div>
                    <div className="flex items-center">
                      <input
                        id="featured"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        {...register('featured')}
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                        Featured Project
                      </label>
                    </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Featured Image
                    </label>
                    <div className="mt-1 flex items-center">
                      {image ? (
                        <div className="relative">
                          <img
                            src={image}
                            alt="Featured"
                            className="h-32 w-32 object-cover rounded-md"
                            onError={(e) => {
                              console.error('Image failed to load:', image);
                              // Try to use a modified URL if the original fails
                              const modifiedUrl = image.replace(window.location.origin, 'http://localhost:5000');
                              console.log('Trying modified URL:', modifiedUrl);
                              e.target.src = modifiedUrl;
                              
                              // Set a second error handler for the modified URL
                              e.target.onerror = () => {
                                console.error('Modified image URL also failed:', modifiedUrl);
                                e.target.onerror = null;
                                e.target.src = '/placeholder-image.png'; // Fallback image
                              };
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setValue('image', '');
                              setValue('coverImage', ''); // Also clear coverImage when image is cleared
                            }}
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setCurrentMediaField('image');
                            setShowMediaLibrary(true);
                            fetchMediaFiles();
                          }}
                          className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
                        >
                          <PhotoIcon className="h-8 w-8" aria-hidden="true" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentMediaField('image');
                          setShowMediaLibrary(true);
                          fetchMediaFiles();
                        }}
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {image ? 'Change' : 'Select'} Image
                      </button>
                      <input
                        type="hidden"
                        {...register('image')}
                      />
                      <input
                        type="hidden"
                        {...register('coverImage')}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Gallery Images
                    </label>
                    <div className="mt-1">
                      <div className="flex flex-wrap gap-4">
                        {galleryImages.map((galleryImage, index) => (
                          <div key={index} className="relative">
                            <img
                              src={galleryImage}
                              alt={`Gallery ${index + 1}`}
                              className="h-32 w-32 object-cover rounded-md"
                              onError={(e) => {
                                console.error('Gallery image failed to load:', galleryImage);
                                // Try to use a modified URL if the original fails
                                const modifiedUrl = galleryImage.replace(window.location.origin, 'http://localhost:5000');
                                console.log('Trying modified URL for gallery image:', modifiedUrl);
                                e.target.src = modifiedUrl;
                                
                                // Set a second error handler for the modified URL
                                e.target.onerror = () => {
                                  console.error('Modified gallery image URL also failed:', modifiedUrl);
                                  e.target.onerror = null;
                                  e.target.src = '/placeholder-image.png'; // Fallback image
                                };
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(index)}
                              className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                        <div
                          onClick={() => {
                            setCurrentMediaField('gallery');
                            setShowMediaLibrary(true);
                            fetchMediaFiles();
                          }}
                          className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
                        >
                          <PlusIcon className="h-8 w-8" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6 border-t border-gray-200 pt-5">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Project Details</h3>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="scope" className="block text-sm font-medium text-gray-700">
                      Project Scope
                    </label>
                    <div className="mt-1">
                      <Controller
                        name="scope"
                        control={control}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            className="h-32 mb-12"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="challenge" className="block text-sm font-medium text-gray-700">
                      Challenge
                    </label>
                    <div className="mt-1">
                      <Controller
                        name="challenge"
                        control={control}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            className="h-32 mb-12"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="solution" className="block text-sm font-medium text-gray-700">
                      Solution
                    </label>
                    <div className="mt-1">
                      <Controller
                        name="solution"
                        control={control}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            className="h-32 mb-12"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="results" className="block text-sm font-medium text-gray-700">
                      Results
                    </label>
                    <div className="mt-1">
                      <Controller
                        name="results"
                        control={control}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            className="h-32 mb-12"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6 border-t border-gray-200 pt-5">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Client Testimonial</h3>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="testimonial.quote" className="block text-sm font-medium text-gray-700">
                      Testimonial Quote
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="testimonial.quote"
                        rows={3}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        {...register('testimonial.quote')}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="testimonial.author" className="block text-sm font-medium text-gray-700">
                      Author Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="testimonial.author"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('testimonial.author')}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="testimonial.position" className="block text-sm font-medium text-gray-700">
                      Author Position
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="testimonial.position"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('testimonial.position')}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6 border-t border-gray-200 pt-5">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">SEO Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Optimize your project for search engines.
                    </p>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="seo.title" className="block text-sm font-medium text-gray-700">
                      SEO Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="seo.title"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('seo.title')}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      If left empty, the project title will be used.
                    </p>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="seo.description" className="block text-sm font-medium text-gray-700">
                      SEO Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="seo.description"
                        rows={2}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        {...register('seo.description')}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="seo.keywords" className="block text-sm font-medium text-gray-700">
                      SEO Keywords
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="seo.keywords"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('seo.keywords')}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Comma-separated keywords for search engines.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/projects')}
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
                      isEditMode ? 'Update Project' : 'Create Project'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Media Library Modal */}
      <MediaLibraryModal 
        isOpen={showMediaLibrary} 
        onClose={() => {
          setShowMediaLibrary(false);
          setCurrentMediaField(null);
        }} 
        onSelect={handleMediaSelect}
        mediaType={currentMediaField === 'image' ? 'image' : 'gallery'}
      />
    </div>
  );
};

export default ProjectForm;