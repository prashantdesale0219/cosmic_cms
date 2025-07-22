import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService, categoryService, tagService, mediaService } from '../../services/api';
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

const BlogPostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      category: '',
      status: 'draft',
      seo: {
        title: '',
        description: '',
        keywords: ''
      }
    }
  });
  
  const title = watch('title');
  const featuredImage = watch('featuredImage');
  
  // Quill editor modules and formats
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image', 'align'
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        if (response.success) {
          // Handle different response formats
          if (response.data && response.data.categories) {
            setCategories(response.data.categories);
          } else if (response.data && Array.isArray(response.data)) {
            setCategories(response.data);
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            setCategories(response.data.data);
          } else {
            // Fallback to empty array to prevent map errors
            console.warn('Unexpected categories response format:', response);
            setCategories([]);
          }
        } else {
          // Set empty array if response is not successful
          setCategories([]);
        }
      } catch (err) {
        console.error('Categories fetch error:', err);
        // Set empty array to prevent map errors
        setCategories([]);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await tagService.getAllTags();
        if (response.success) {
          // Handle potential nested data structure
          if (response.data && response.data.tags) {
            setTags(response.data.tags);
          } else if (response.data && Array.isArray(response.data)) {
            setTags(response.data);
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            setTags(response.data.data);
          } else {
            console.warn('Unexpected tags response format:', response);
            setTags([]);
          }
        } else {
          // Set empty array if response is not successful
          setTags([]);
        }
      } catch (err) {
        console.error('Tags fetch error:', err);
        // Set empty array to prevent map errors
        setTags([]);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!isEditMode) return;
      
      try {
        setIsFetching(true);
        setError(null);
        
        const response = await blogService.getPostById(id);
        
        if (response.success) {
          const postData = response.data;
          reset({
            title: postData.title,
            slug: postData.slug,
            content: postData.content,
            excerpt: postData.excerpt || '',
            featuredImage: postData.featuredImage || '',
            category: postData.category?._id || '',
            status: postData.status || 'draft',
            seo: {
              title: postData.seo?.title || '',
              description: postData.seo?.description || '',
              keywords: postData.seo?.keywords || ''
            }
          });
          
          if (postData.tags && postData.tags.length > 0) {
            setSelectedTags(postData.tags.map(tag => tag._id));
          }
        } else {
          setError('Failed to load blog post data');
          toast.error('Failed to load blog post data');
        }
      } catch (err) {
        console.error('Blog post fetch error:', err);
        setError('An error occurred while loading blog post data');
        toast.error('An error occurred while loading blog post data');
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [id, isEditMode, reset]);

  useEffect(() => {
    if (title && !isEditMode) {
      setValue('slug', slugify(title));
    }
  }, [title, setValue, isEditMode]);

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
      setIsLoadingMedia(false);
    }
  };

  // Use fetchMediaFiles directly for pagination
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
      console.log('Setting featured image URL:', mediaUrl);
      setValue('featuredImage', mediaUrl);
      toast.success('Featured image selected successfully');
    } else {
      console.error('Invalid media object structure:', media);
      toast.error('Could not determine media URL');
    }
    
    setShowMediaLibrary(false);
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Form data being submitted:', data);
      
      // Map form field names to backend field names
      const blogPostData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage, // Try both featuredImage and image fields
        image: data.featuredImage, // Some backends might expect 'image' instead
        tags: selectedTags,
        category: data.category, // Send as single value
        categories: data.category ? [data.category] : [], // Also send as array for compatibility
        status: data.status, // Send status directly
        isPublished: data.status === 'published', // Also send boolean flag
        seo: {
          title: data.seo?.title || data.title,
          description: data.seo?.description || data.excerpt,
          keywords: data.seo?.keywords || ''
        },
        // Also include these fields directly at the top level for compatibility
        metaTitle: data.seo?.title || data.title,
        metaDescription: data.seo?.description || data.excerpt,
        metaKeywords: data.seo?.keywords || ''
      };
      
      console.log('Formatted blog post data:', blogPostData);
      
      let response;
      
      if (isEditMode) {
        console.log(`Updating blog post with ID: ${id}`);
        response = await blogService.updatePost(id, blogPostData);
      } else {
        console.log('Creating new blog post');
        response = await blogService.createPost(blogPostData);
      }
      
      console.log('API response:', response);
      
      // Handle standardized response format
      if (response && response.success) {
        toast.success(isEditMode ? 'Blog post updated successfully' : 'Blog post created successfully');
        navigate('/posts');
      } else {
        const errorMessage = 
          response?.message || 
          (isEditMode ? 'Failed to update blog post' : 'Failed to create blog post');
        
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error response:', response);
      }
    } catch (err) {
      console.error('Blog post save error:', err);
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
          {isEditMode ? 'Edit Blog Post' : 'Create Blog Post'}
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
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <div className="mt-1">
                      <Controller
                        name="content"
                        control={control}
                        rules={{ required: 'Content is required' }}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            value={field.value}
                            onChange={field.onChange}
                            className="h-64 mb-12"
                          />
                        )}
                      />
                      {errors.content && (
                        <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                      Excerpt
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="excerpt"
                        rows={3}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        {...register('excerpt')}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      A short description of the blog post. If left empty, an excerpt will be generated from the content.
                    </p>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Featured Image
                    </label>
                    <div className="mt-1 flex items-center">
                      {featuredImage ? (
                        <div className="relative">
                          <img
                            src={featuredImage}
                            alt="Featured"
                            className="h-32 w-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => setValue('featuredImage', '')}
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
                          className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
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
                        {featuredImage ? 'Change' : 'Select'} Image
                      </button>
                      <input
                        type="hidden"
                        {...register('featuredImage')}
                      />
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
                        {...register('category')}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
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
                        <option value="published">Published</option>
                      </select>
                      {errors.status && (
                        <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Tags
                    </label>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <div 
                            key={tag._id} 
                            onClick={() => handleTagToggle(tag._id)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${selectedTags.includes(tag._id) ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                          >
                            {tag.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6 border-t border-gray-200 pt-5">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">SEO Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Optimize your blog post for search engines.
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
                      If left empty, the post title will be used.
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
                    <p className="mt-2 text-sm text-gray-500">
                      If left empty, the post excerpt will be used.
                    </p>
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
                    onClick={() => navigate('/blog-posts')}
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
                      isEditMode ? 'Update Post' : 'Create Post'
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
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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

export default BlogPostForm;