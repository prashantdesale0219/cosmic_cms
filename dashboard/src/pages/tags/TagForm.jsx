import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { tagService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { slugify } from '../../utils/helpers';

const TagForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      slug: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const name = watch('name');
  const slug = watch('slug');

  useEffect(() => {
    if (isEditMode) {
      fetchTag();
    }
  }, [id]);

  useEffect(() => {
    if (name && !isSlugManuallyEdited) {
      setValue('slug', slugify(name));
    }
  }, [name, setValue, isSlugManuallyEdited]);

  const fetchTag = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await tagService.getTagById(id);
      
      if (response.success) {
        const tag = response.data;
        reset({
          name: tag.name,
          slug: tag.slug
        });
        setIsSlugManuallyEdited(true);
      } else {
        setError('Failed to fetch tag details');
        toast.error('Failed to fetch tag details');
      }
    } catch (err) {
      console.error('Tag fetch error:', err);
      setError('An error occurred while fetching tag details');
      toast.error('An error occurred while fetching tag details');
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
        response = await tagService.updateTag(id, data);
      } else {
        response = await tagService.createTag(data);
      }
      
      if (response.success) {
        toast.success(isEditMode ? 'Tag updated successfully' : 'Tag created successfully');
        navigate('/tags');
      } else {
        setError(response.message || (isEditMode ? 'Failed to update tag' : 'Failed to create tag'));
        toast.error(response.message || (isEditMode ? 'Failed to update tag' : 'Failed to create tag'));
      }
    } catch (err) {
      console.error('Tag save error:', err);
      setError('An error occurred while saving the tag');
      toast.error('An error occurred while saving the tag');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlugChange = () => {
    setIsSlugManuallyEdited(true);
  };

  const handleCancel = () => {
    navigate('/tags');
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? 'Edit Tag' : 'Create New Tag'}
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Tag Information</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Provide the details for this tag.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        {...register('name', { required: 'Name is required' })}
                        className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                      Slug *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="slug"
                        {...register('slug', { 
                          required: 'Slug is required',
                          pattern: {
                            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                            message: 'Slug must contain only lowercase letters, numbers, and hyphens'
                          }
                        })}
                        onChange={handleSlugChange}
                        className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.slug ? 'border-red-300' : ''}`}
                      />
                    </div>
                    {errors.slug ? (
                      <p className="mt-2 text-sm text-red-600">{errors.slug.message}</p>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">
                        URL-friendly version of the name. Used in URLs.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
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
                    <>{isEditMode ? 'Update Tag' : 'Create Tag'}</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TagForm;