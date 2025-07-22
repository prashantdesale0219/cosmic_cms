import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { settingsService } from '../../services/api';
import { toast } from 'react-hot-toast';

const AdvancedSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isRebuilding, setIsRebuilding] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await settingsService.getAdvancedSettings();
      
      if (response.success) {
        const settings = response.data;
        
        // Set form values
        setValue('maintenanceMode', settings.maintenanceMode || false);
        setValue('maintenanceMessage', settings.maintenanceMessage || '');
        setValue('cacheEnabled', settings.cacheEnabled || false);
        setValue('cacheTTL', settings.cacheTTL || 3600);
        setValue('debugMode', settings.debugMode || false);
        setValue('apiRateLimit', settings.apiRateLimit || 60);
        setValue('customCss', settings.customCss || '');
        setValue('customJs', settings.customJs || '');
        setValue('robotsTxt', settings.robotsTxt || '');
        setValue('htaccessRules', settings.htaccessRules || '');
      } else {
        toast.error('Failed to fetch advanced settings');
      }
    } catch (err) {
      console.error('Advanced settings fetch error:', err);
      toast.error('An error occurred while fetching advanced settings');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      
      const response = await settingsService.updateAdvancedSettings(data);
      
      if (response.success) {
        toast.success('Advanced settings updated successfully');
      } else {
        toast.error(response.message || 'Failed to update advanced settings');
      }
    } catch (err) {
      console.error('Advanced settings update error:', err);
      toast.error('An error occurred while updating advanced settings');
    } finally {
      setIsSaving(false);
    }
  };

  const clearCache = async () => {
    try {
      setIsClearing(true);
      const response = await settingsService.clearCache();
      
      if (response.success) {
        toast.success('Cache cleared successfully');
      } else {
        toast.error(response.message || 'Failed to clear cache');
      }
    } catch (err) {
      console.error('Cache clear error:', err);
      toast.error('An error occurred while clearing cache');
    } finally {
      setIsClearing(false);
    }
  };

  const rebuildIndex = async () => {
    try {
      setIsRebuilding(true);
      const response = await settingsService.rebuildSearchIndex();
      
      if (response.success) {
        toast.success('Search index rebuilt successfully');
      } else {
        toast.error(response.message || 'Failed to rebuild search index');
      }
    } catch (err) {
      console.error('Rebuild index error:', err);
      toast.error('An error occurred while rebuilding search index');
    } finally {
      setIsRebuilding(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Advanced Settings</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Site Maintenance */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Maintenance Mode
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Enable maintenance mode when your site is undergoing updates.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="maintenanceMode"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            {...register('maintenanceMode')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                            Enable Maintenance Mode
                          </label>
                          <p className="text-gray-500">
                            When enabled, visitors will see a maintenance message instead of your website.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700">
                        Maintenance Message
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="maintenanceMessage"
                          rows={3}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="We're currently performing maintenance. Please check back soon."
                          {...register('maintenanceMessage')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        This message will be displayed to visitors when maintenance mode is enabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance & Caching */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Performance & Caching
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Configure caching settings to improve site performance.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="cacheEnabled"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            {...register('cacheEnabled')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="cacheEnabled" className="font-medium text-gray-700">
                            Enable Page Caching
                          </label>
                          <p className="text-gray-500">
                            Cache pages to reduce server load and improve performance.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="cacheTTL" className="block text-sm font-medium text-gray-700">
                        Cache TTL (seconds)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="cacheTTL"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          min="0"
                          {...register('cacheTTL', { 
                            valueAsNumber: true,
                            min: {
                              value: 0,
                              message: 'Cache TTL must be a positive number'
                            }
                          })}
                        />
                        {errors.cacheTTL && (
                          <p className="mt-1 text-sm text-red-600">{errors.cacheTTL.message}</p>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Time (in seconds) that cached content will be stored. Default: 3600 (1 hour).
                      </p>
                    </div>

                    <div className="sm:col-span-6">
                      <button
                        type="button"
                        onClick={clearCache}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        disabled={isClearing}
                      >
                        {isClearing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Clearing Cache...
                          </>
                        ) : 'Clear Cache'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* API & Security */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    API & Security
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Configure API rate limiting and security settings.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="apiRateLimit" className="block text-sm font-medium text-gray-700">
                        API Rate Limit (requests per minute)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="apiRateLimit"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          min="1"
                          {...register('apiRateLimit', { 
                            valueAsNumber: true,
                            min: {
                              value: 1,
                              message: 'Rate limit must be at least 1'
                            }
                          })}
                        />
                        {errors.apiRateLimit && (
                          <p className="mt-1 text-sm text-red-600">{errors.apiRateLimit.message}</p>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Maximum number of API requests allowed per minute per IP address.
                      </p>
                    </div>

                    <div className="sm:col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="debugMode"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            {...register('debugMode')}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="debugMode" className="font-medium text-gray-700">
                            Enable Debug Mode
                          </label>
                          <p className="text-gray-500">
                            Show detailed error messages. Only enable in development environments.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Search Settings
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Configure search functionality and indexing.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <button
                        type="button"
                        onClick={rebuildIndex}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        disabled={isRebuilding}
                      >
                        {isRebuilding ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Rebuilding Index...
                          </>
                        ) : 'Rebuild Search Index'}
                      </button>
                      <p className="mt-2 text-sm text-gray-500">
                        Rebuild the search index to include all content. This may take a few minutes depending on the amount of content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Code */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Custom Code
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Add custom CSS and JavaScript to your site.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="customCss" className="block text-sm font-medium text-gray-700">
                        Custom CSS
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="customCss"
                          rows={6}
                          className="font-mono shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="/* Your custom CSS here */"
                          {...register('customCss')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Custom CSS that will be added to all pages of your site.
                      </p>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="customJs" className="block text-sm font-medium text-gray-700">
                        Custom JavaScript
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="customJs"
                          rows={6}
                          className="font-mono shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="// Your custom JavaScript here"
                          {...register('customJs')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Custom JavaScript that will be added to all pages of your site.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO & Server */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    SEO & Server Configuration
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Configure robots.txt and .htaccess rules.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="robotsTxt" className="block text-sm font-medium text-gray-700">
                        robots.txt Content
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="robotsTxt"
                          rows={6}
                          className="font-mono shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="User-agent: *\nDisallow: /admin/\nDisallow: /dashboard/"
                          {...register('robotsTxt')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Content for your robots.txt file. This tells search engines which pages to index.
                      </p>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="htaccessRules" className="block text-sm font-medium text-gray-700">
                        .htaccess Rules
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="htaccessRules"
                          rows={6}
                          className="font-mono shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="# Custom .htaccess rules\n# Example: Redirect rules, caching headers, etc."
                          {...register('htaccessRules')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Custom .htaccess rules for Apache servers. Be careful with these settings as incorrect rules can break your site.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Save Settings'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;