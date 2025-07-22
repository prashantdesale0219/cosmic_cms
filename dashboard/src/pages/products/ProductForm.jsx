import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, categoryService, mediaService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
                                                                                                import Modal from 'react-modal';
import 'react-quill/dist/quill.snow.css';
import './MediaLibrary.css';
import { slugify } from '../../utils/helpers';

// Set app element for accessibility
Modal.setAppElement('#root');

// Import icons
import { 
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: '',
      comparePrice: '',
      images: [],
      category: 'solar-panels', // Set default category
      status: 'draft',
      inStock: true,
      features: [],
      specifications: [],
      seo: {
        title: '',
        description: '',
        keywords: ''
      }
    }
  });
  
  const name = watch('name');
  const images = watch('images') || [];
  const features = watch('features') || [];
  const specifications = watch('specifications') || [];
  
  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      console.log('Fetching categories for product form');
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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEditMode) return;
      
      try {
        setIsFetching(true);
        setError(null);
        
        console.log('Fetching product with ID:', id);
        const response = await productService.getProductById(id);
        console.log('Product fetch response:', response);
        
        if (response && response.success) {
          const productData = response.data;
          
          // Convert specifications object to array format for the form
          let specificationsArray = [];
          if (productData.specifications && typeof productData.specifications === 'object') {
            specificationsArray = Object.entries(productData.specifications).map(([name, value]) => ({
              name,
              value: value || ''
            }));
          }
          
          console.log('Original specifications:', productData.specifications);
          console.log('Converted specifications array:', specificationsArray);
          
          // Prepare images array
          const imagesArray = [];
          if (productData.image) imagesArray.push(productData.image);
          if (productData.hoverImage && productData.hoverImage !== productData.image) {
            imagesArray.push(productData.hoverImage);
          }
          if (productData.additionalImages && Array.isArray(productData.additionalImages)) {
            imagesArray.push(...productData.additionalImages);
          }
          
          reset({
            name: productData.title, // Map backend field names to form field names
            slug: productData.slug,
            description: productData.description,
            price: productData.newPrice,
            comparePrice: productData.oldPrice || '',
            images: imagesArray,
            category: productData.category || '',
            status: productData.isActive ? 'published' : 'draft',
            inStock: productData.stock > 0,
            features: productData.features || [],
            specifications: specificationsArray,
            seo: {
              title: productData.seo?.title || '',
              description: productData.seo?.description || '',
              keywords: productData.seo?.keywords || ''
            }
          });
        } else {
          const errorMsg = response?.message || 'Failed to load product data';
          console.error('Product fetch error:', errorMsg);
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        console.error('Product fetch error:', err);
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred while loading product data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode, reset]);

  useEffect(() => {
    if (name && !isEditMode) {
      setValue('slug', slugify(name));
    }
  }, [name, setValue, isEditMode]);

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
    
    if (currentImageIndex !== null) {
      // Update existing image
      const newImages = [...images];
      newImages[currentImageIndex] = url;
      setValue('images', newImages);
      console.log('Updated image at index', currentImageIndex, 'with', url);
    } else {
      // Add new image
      setValue('images', [...images, url]);
      console.log('Added new image to array:', url);
    }
    
    // Close the media library modal
    setShowMediaLibrary(false);
    setCurrentImageIndex(null);
    toast.success('Image selected successfully');
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue('images', newImages);
  };

  const handleAddFeature = () => {
    setValue('features', [...features, '']);
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setValue('features', newFeatures);
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setValue('features', newFeatures);
  };

  const handleAddSpecification = () => {
    setValue('specifications', [...specifications, { name: '', value: '' }]);
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setValue('specifications', newSpecs);
  };

  const handleRemoveSpecification = (index) => {
    const newSpecs = [...specifications];
    newSpecs.splice(index, 1);
    setValue('specifications', newSpecs);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate required fields
      if (!data.images || data.images.length === 0) {
        setError('Cover image is required');
        toast.error('Cover image is required');
        setIsLoading(false);
        return;
      }
      
      // Debug logs
      console.log('Form data submitted:', data);
      console.log('Edit mode:', isEditMode);
      console.log('Product ID:', id);
      
      // Convert specifications array to object format expected by the backend
      const specificationsObject = {};
      if (data.specifications && Array.isArray(data.specifications)) {
        data.specifications.forEach(spec => {
          if (spec.name && spec.value) {
            specificationsObject[spec.name] = spec.value;
          }
        });
      }
      console.log('Converted specifications:', specificationsObject);
      
      // Map form field names to backend field names
      const productData = {
        title: data.name,
        slug: data.slug,
        description: data.description,
        newPrice: data.price,
        oldPrice: data.comparePrice || data.price,
        image: data.images && data.images.length > 0 ? data.images[0] : null,
        hoverImage: data.images && data.images.length > 1 ? data.images[1] : data.images[0], // Always use first image as hover image if second is not available
        additionalImages: data.images && data.images.length > 2 ? data.images.slice(2) : [],
        category: data.category, // Use the selected category from the form
        status: ['New'], // Using a valid enum value from the Product model as an array
        stock: data.inStock ? 1 : 0,
        isActive: true, // Set to true for active status
        features: data.features,
        specifications: specificationsObject, // Use the converted specifications object
        seo: data.seo
      };
      
      // Debug log for product data
      console.log('Product data being sent to API:', productData);
      
      let response;
      
      if (isEditMode) {
        console.log('Calling updateProduct with ID:', id);
        response = await productService.updateProduct(id, productData);
        console.log('Update product response:', response);
      } else {
        console.log('Calling createProduct');
        response = await productService.createProduct(productData);
        console.log('Create product response:', response);
      }
      
      if (response && response.success) {
        toast.success(isEditMode ? 'Product updated successfully' : 'Product created successfully');
        navigate('/products');
      } else {
        console.error('API returned error:', response);
        setError(response?.message || (isEditMode ? 'Failed to update product' : 'Failed to create product'));
        toast.error(response?.message || (isEditMode ? 'Failed to update product' : 'Failed to create product'));
      }
    } catch (err) {
      console.error('Product save error:', err);
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
          {isEditMode ? 'Edit Product' : 'Create Product'}
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('name', { required: 'Product name is required' })}
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
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
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (₹)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="price"
                        min="0"
                        step="0.01"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('price', { 
                          required: 'Price is required',
                          min: { value: 0, message: 'Price must be positive' },
                          valueAsNumber: true
                        })}
                      />
                      {errors.price && (
                        <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="comparePrice" className="block text-sm font-medium text-gray-700">
                      Compare Price (₹) (Optional)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="comparePrice"
                        min="0"
                        step="0.01"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('comparePrice', { 
                          min: { value: 0, message: 'Compare price must be positive' },
                          valueAsNumber: true
                        })}
                      />
                      {errors.comparePrice && (
                        <p className="mt-2 text-sm text-red-600">{errors.comparePrice.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Images
                    </label>
                    <div className="mt-1">
                      <div className="flex flex-wrap gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="h-32 w-32 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentImageIndex(index);
                                setShowMediaLibrary(true);
                                fetchMediaFiles();
                              }}
                              className="absolute bottom-0 right-0 mb-2 mr-2 bg-white rounded-full p-1 text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                        <div
                          onClick={() => {
                            setCurrentImageIndex(null);
                            setShowMediaLibrary(true);
                            fetchMediaFiles();
                          }}
                          className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
                        >
                          <PhotoIcon className="h-8 w-8" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category field */}
                  <div className="sm:col-span-3">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="mt-1">
                      <select
                        id="category"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register('category', { required: 'Category is required' })}
                        disabled={isLoadingCategories}
                      >
                        <option value="">Select a category</option>
                        {isLoadingCategories ? (
                          <option value="" disabled>Loading categories...</option>
                        ) : categories && categories.length > 0 ? (
                          categories.map((category) => (
                            <option 
                              key={category._id || category.id || category.slug} 
                              value={category._id || category.id || category.slug}
                            >
                              {category.name}
                            </option>
                          ))
                        ) : (
                          // Fallback options if no categories are loaded
                          <>
                            <option value="solar-panels">Solar Panels</option>
                            <option value="inverters">Inverters</option>
                            <option value="batteries">Batteries</option>
                            <option value="accessories">Accessories</option>
                          </>
                        )}
                      </select>
                      {errors.category && (
                        <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
                      )}
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
                        <option value="active">Active</option>
                      </select>
                      {errors.status && (
                        <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <div className="flex items-center">
                      <input
                        id="inStock"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        {...register('inStock')}
                      />
                      <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                        In Stock
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-6 border-t border-gray-200 pt-5">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Product Features</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add key features of your product.
                    </p>
                  </div>

                  <div className="sm:col-span-6">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Enter a feature"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="ml-2 text-red-600 hover:text-red-900"
                        >
                          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                      Add Feature
                    </button>
                  </div>

                  <div className="sm:col-span-6 border-t border-gray-200 pt-5">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Product Specifications</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add technical specifications of your product.
                    </p>
                  </div>

                  <div className="sm:col-span-6">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={spec.name}
                          onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Specification name"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                          className="ml-2 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Specification value"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecification(index)}
                          className="ml-2 text-red-600 hover:text-red-900"
                        >
                          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddSpecification}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                      Add Specification
                    </button>
                  </div>

                  <div className="sm:col-span-6 border-t border-gray-200 pt-5">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">SEO Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Optimize your product for search engines.
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
                      If left empty, the product name will be used.
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
                    onClick={() => navigate('/products')}
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
                      isEditMode ? 'Update Product' : 'Create Product'
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
          setCurrentImageIndex(null);
        }}
        className="media-library-modal"
        overlayClassName="media-library-overlay"
      >
        <div className="media-library-container">
          <div className="media-library-header">
            <h2>Media Library</h2>
            <button 
              className="close-button"
              onClick={() => {
                setShowMediaLibrary(false);
                setCurrentImageIndex(null);
              }}
            >
              &times;
            </button>
          </div>
          
          <div className="media-files-container">
            {isLoadingMedia ? (
              <div className="loading-indicator">Loading media...</div>
            ) : (
              <>
                {mediaFiles && mediaFiles.length > 0 ? (
                  <div className="media-grid">
                    {mediaFiles.map((media) => (
                      <div 
                        key={media._id} 
                        className="media-item"
                        onClick={() => handleMediaSelect(media.url)}
                      >
                        <img 
                          src={media.url} 
                          alt={media.name || 'Media'} 
                          className="media-thumbnail"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.png'; // Fallback image
                            console.log('Image failed to load:', media.url);
                          }}
                        />
                        <div className="media-name">{media.name || 'Unnamed'}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-media">
                    <p>No media files found</p>
                    <p className="no-media-hint">You can upload new media files from the Media section</p>
                  </div>
                )}
                
                {totalMediaPages > 1 && (
                  <div className="pagination">
                    <button 
                      onClick={() => handleMediaPageChange(mediaPage - 1)}
                      disabled={mediaPage === 1}
                    >
                      Previous
                    </button>
                    <span>Page {mediaPage} of {totalMediaPages}</span>
                    <button 
                      onClick={() => handleMediaPageChange(mediaPage + 1)}
                      disabled={mediaPage === totalMediaPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="media-library-footer">
            <button 
              className="cancel-button"
              onClick={() => {
                setShowMediaLibrary(false);
                setCurrentImageIndex(null);
              }}
            >
              Cancel
            </button>
            <button 
              className="refresh-button"
              onClick={() => fetchMediaFiles(1)}
              disabled={isLoadingMedia}
            >
              Refresh Media
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductForm;