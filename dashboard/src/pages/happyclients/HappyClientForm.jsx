import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { happyClientService } from '../../services/api';

// Import icons
import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const HappyClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: 'Happy Clients',
      subtitle: '',
      description: '',
      backgroundVideo: '',
      companyVideo: '',
      ctaText: 'Learn More About Us',
      ctaLink: '/about',
      isActive: true,
      stats: [
        { value: 30, label: 'Years of Experience', icon: 'FaUsers', color: '#9fc22f', suffix: '+', description: '', order: 0 },
        { value: 10000, label: 'Successful Projects', icon: 'FaProjectDiagram', color: 'rgb(28 155 231)', suffix: '+', description: '', order: 1 },
        { value: 2, label: 'Modules Shipped', icon: 'FaSolarPanel', color: '#9fc22f', suffix: 'M+', description: '', order: 2 },
        { value: 1.5, label: 'PV Modules Manufacturing Capacity', icon: 'FaBolt', color: 'rgb(28 155 231)', suffix: 'GW', description: '+2.5 GW Under Development', order: 3 }
      ]
    }
  });

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'stats'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      fetchHappyClient();
    }
  }, [id]);

  const fetchHappyClient = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await happyClientService.getHappyClientById(id);
      
      if (response.data && response.data.success) {
        const happyClient = response.data.data;
        
        // Set form values
        reset({
          title: happyClient.title || 'Happy Clients',
          subtitle: happyClient.subtitle || '',
          description: happyClient.description || '',
          backgroundVideo: happyClient.backgroundVideo || '',
          companyVideo: happyClient.companyVideo || '',
          ctaText: happyClient.ctaText || 'Learn More About Us',
          ctaLink: happyClient.ctaLink || '/about',
          isActive: happyClient.isActive !== undefined ? happyClient.isActive : true,
          stats: happyClient.stats && happyClient.stats.length > 0 
            ? happyClient.stats.map((stat, index) => ({
                value: stat.value,
                label: stat.label,
                icon: stat.icon || 'FaUsers',
                color: stat.color || '#9fc22f',
                suffix: stat.suffix || '+',
                description: stat.description || '',
                order: stat.order || index,
                _id: stat._id
              }))
            : [
                { value: 30, label: 'Years of Experience', icon: 'FaUsers', color: '#9fc22f', suffix: '+', description: '', order: 0 },
                { value: 10000, label: 'Successful Projects', icon: 'FaProjectDiagram', color: 'rgb(28 155 231)', suffix: '+', description: '', order: 1 },
                { value: 2, label: 'Modules Shipped', icon: 'FaSolarPanel', color: '#9fc22f', suffix: 'M+', description: '', order: 2 },
                { value: 1.5, label: 'PV Modules Manufacturing Capacity', icon: 'FaBolt', color: 'rgb(28 155 231)', suffix: 'GW', description: '+2.5 GW Under Development', order: 3 }
              ]
        });
      } else {
        setError('Failed to fetch happy client section');
        toast.error('Failed to fetch happy client section');
      }
    } catch (err) {
      console.error('Happy client fetch error:', err);
      setError('An error occurred while fetching the happy client section');
      toast.error('An error occurred while fetching the happy client section');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Update order based on current position
      data.stats = data.stats.map((stat, index) => ({
        ...stat,
        order: index
      }));
      
      let responseData;
      
      if (isEditMode) {
        responseData = await happyClientService.updateHappyClient(id, data);
      } else {
        responseData = await happyClientService.createHappyClient(data);
      }
      
      if (responseData.data && responseData.data.success) {
        toast.success(`Happy client section ${isEditMode ? 'updated' : 'created'} successfully`);
        navigate('/happy-clients');
      } else {
        setError(responseData.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} happy client section`);
        toast.error(responseData.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} happy client section`);
      }
    } catch (err) {
      console.error('Happy client submit error:', err);
      setError(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the happy client section`);
      toast.error(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the happy client section`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      swap(index, index - 1);
    }
  };

  const handleMoveDown = (index) => {
    if (index < fields.length - 1) {
      swap(index, index + 1);
    }
  };

  const handleAddStat = () => {
    append({ 
      value: 0, 
      label: 'New Statistic', 
      icon: 'FaUsers', 
      color: '#9fc22f', 
      suffix: '+', 
      description: '',
      order: fields.length 
    });
  };

  const iconOptions = [
    { value: 'FaUsers', label: 'Users' },
    { value: 'FaProjectDiagram', label: 'Projects' },
    { value: 'FaSolarPanel', label: 'Solar Panel' },
    { value: 'FaBolt', label: 'Energy' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Happy Client Section' : 'Create Happy Client Section'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode 
            ? 'Update the happy client section information and statistics' 
            : 'Create a new happy client section with statistics'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                General information about the happy client section.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
                    {...register('subtitle')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    rows={3}
                    {...register('description')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="backgroundVideo" className="block text-sm font-medium text-gray-700">
                  Background Video URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="backgroundVideo"
                    {...register('backgroundVideo')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="companyVideo" className="block text-sm font-medium text-gray-700">
                  Company Video URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="companyVideo"
                    {...register('companyVideo')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700">
                  CTA Button Text
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="ctaText"
                    {...register('ctaText')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="ctaLink" className="block text-sm font-medium text-gray-700">
                  CTA Button Link
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="ctaLink"
                    {...register('ctaLink')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center">
                  <input
                    id="isActive"
                    type="checkbox"
                    {...register('isActive')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Statistics</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add statistics to display in the happy client section.
              </p>
            </div>

            <div className="mt-6">
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-medium text-gray-900">Statistic #{index + 1}</h4>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${index === 0 ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === fields.length - 1}
                          className={`inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white ${index === fields.length - 1 ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-2">
                        <label htmlFor={`stats.${index}.value`} className="block text-sm font-medium text-gray-700">
                          Value
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id={`stats.${index}.value`}
                            {...register(`stats.${index}.value`, { required: 'Value is required', valueAsNumber: true })}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          {errors.stats?.[index]?.value && (
                            <p className="mt-1 text-sm text-red-600">{errors.stats[index].value.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor={`stats.${index}.label`} className="block text-sm font-medium text-gray-700">
                          Label
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id={`stats.${index}.label`}
                            {...register(`stats.${index}.label`, { required: 'Label is required' })}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          {errors.stats?.[index]?.label && (
                            <p className="mt-1 text-sm text-red-600">{errors.stats[index].label.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor={`stats.${index}.icon`} className="block text-sm font-medium text-gray-700">
                          Icon
                        </label>
                        <div className="mt-1">
                          <select
                            id={`stats.${index}.icon`}
                            {...register(`stats.${index}.icon`)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            {iconOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor={`stats.${index}.color`} className="block text-sm font-medium text-gray-700">
                          Color
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id={`stats.${index}.color`}
                            {...register(`stats.${index}.color`)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor={`stats.${index}.suffix`} className="block text-sm font-medium text-gray-700">
                          Suffix
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id={`stats.${index}.suffix`}
                            {...register(`stats.${index}.suffix`)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor={`stats.${index}.description`} className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id={`stats.${index}.description`}
                            {...register(`stats.${index}.description`)}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleAddStat}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Statistic
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/happy-clients')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HappyClientForm;