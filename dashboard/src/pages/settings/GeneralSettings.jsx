import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { settingsService, mediaService } from '../../services/api';
import { toast } from 'react-hot-toast';
import MediaLibraryModal from '../../components/MediaLibraryModal';

const GeneralSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaType, setMediaType] = useState(''); // logo, favicon, etc.
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');
  const [defaultImagePreview, setDefaultImagePreview] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm();

  // Watch form values for logo, favicon, and default image
  const logo = watch('logo');
  const favicon = watch('favicon');
  const defaultImage = watch('defaultImage');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await settingsService.getSettings();
      
      if (response.success) {
        const settings = response.data;
        
        // Set form values
        setValue('siteName', settings.siteName);
        setValue('siteDescription', settings.siteDescription);
        setValue('siteKeywords', settings.siteKeywords);
        setValue('siteUrl', settings.siteUrl);
        setValue('logo', settings.logo);
        setValue('favicon', settings.favicon);
        setValue('defaultImage', settings.defaultImage);
        setValue('contactEmail', settings.contactEmail);
        setValue('contactPhone', settings.contactPhone);
        setValue('address', settings.address);
        setValue('googleAnalyticsId', settings.googleAnalyticsId);
        setValue('facebookPixelId', settings.facebookPixelId);
        setValue('socialFacebook', settings.socialLinks?.facebook || '');
        setValue('socialTwitter', settings.socialLinks?.twitter || '');
        setValue('socialInstagram', settings.socialLinks?.instagram || '');
        setValue('socialLinkedin', settings.socialLinks?.linkedin || '');
        setValue('socialYoutube', settings.socialLinks?.youtube || '');
        
        // Set preview images
        setLogoPreview(settings.logo || '');
        setFaviconPreview(settings.favicon || '');
        setDefaultImagePreview(settings.defaultImage || '');
      } else {
        toast.error('Failed to fetch settings');
      }
    } catch (err) {
      console.error('Settings fetch error:', err);
      toast.error('An error occurred while fetching settings');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      
      // Format social links
      const socialLinks = {
        facebook: data.socialFacebook,
        twitter: data.socialTwitter,
        instagram: data.socialInstagram,
        linkedin: data.socialLinkedin,
        youtube: data.socialYoutube
      };
      
      // Remove social fields from data
      const { 
        socialFacebook, socialTwitter, socialInstagram, 
        socialLinkedin, socialYoutube, 
        ...settingsData 
      } = data;
      
      // Add social links to settings data
      settingsData.socialLinks = socialLinks;
      
      const response = await settingsService.updateSettings(settingsData);
      
      if (response.success) {
        toast.success('Settings updated successfully');
      } else {
        toast.error(response.message || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Settings update error:', err);
      toast.error('An error occurred while updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaSelect = (media) => {
    if (mediaType === 'logo') {
      setValue('logo', media.url);
      setLogoPreview(media.url);
    } else if (mediaType === 'favicon') {
      setValue('favicon', media.url);
      setFaviconPreview(media.url);
    } else if (mediaType === 'defaultImage') {
      setValue('defaultImage', media.url);
      setDefaultImagePreview(media.url);
    }
    
    setShowMediaModal(false);
  };

  const openMediaModal = (type) => {
    setMediaType(type);
    setShowMediaModal(true);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">General Settings</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Site Information */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Site Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Basic information about your website.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                        Site Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="siteName"
                          className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.siteName ? 'border-red-300' : ''}`}
                          {...register('siteName', { required: 'Site name is required' })}
                        />
                        {errors.siteName && (
                          <p className="mt-1 text-sm text-red-600">{errors.siteName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                        Site Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="siteDescription"
                          rows={3}
                          className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.siteDescription ? 'border-red-300' : ''}`}
                          {...register('siteDescription')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Brief description of your website. This will be used in meta tags.
                      </p>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="siteKeywords" className="block text-sm font-medium text-gray-700">
                        Site Keywords
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="siteKeywords"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="keyword1, keyword2, keyword3"
                          {...register('siteKeywords')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Comma-separated keywords for SEO.
                      </p>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700">
                        Site URL
                      </label>
                      <div className="mt-1">
                        <input
                          type="url"
                          id="siteUrl"
                          className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.siteUrl ? 'border-red-300' : ''}`}
                          placeholder="https://example.com"
                          {...register('siteUrl', {
                            pattern: {
                              value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(:[0-9]{1,5})?(\/.*)?$/,
                              message: 'Please enter a valid URL'
                            }
                          })}
                        />
                        {errors.siteUrl && (
                          <p className="mt-1 text-sm text-red-600">{errors.siteUrl.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Site Media */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Site Media
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Logo, favicon, and default images for your website.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Logo</label>
                      <div className="mt-1 flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Site Logo"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                        </div>
                        <input
                          type="hidden"
                          {...register('logo')}
                        />
                        <button
                          type="button"
                          onClick={() => openMediaModal('logo')}
                          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Select Logo
                        </button>
                        {logo && (
                          <button
                            type="button"
                            onClick={() => {
                              setValue('logo', '');
                              setLogoPreview('');
                            }}
                            className="ml-2 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Recommended size: 200x50 pixels. PNG or SVG format with transparent background.
                      </p>
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Favicon</label>
                      <div className="mt-1 flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                          {faviconPreview ? (
                            <img
                              src={faviconPreview}
                              alt="Favicon"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                        </div>
                        <input
                          type="hidden"
                          {...register('favicon')}
                        />
                        <button
                          type="button"
                          onClick={() => openMediaModal('favicon')}
                          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Select Favicon
                        </button>
                        {favicon && (
                          <button
                            type="button"
                            onClick={() => {
                              setValue('favicon', '');
                              setFaviconPreview('');
                            }}
                            className="ml-2 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Recommended size: 32x32 or 16x16 pixels. ICO, PNG, or SVG format.
                      </p>
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Default Image</label>
                      <div className="mt-1 flex items-center">
                        <div className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-md overflow-hidden">
                          {defaultImagePreview ? (
                            <img
                              src={defaultImagePreview}
                              alt="Default Image"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                        </div>
                        <input
                          type="hidden"
                          {...register('defaultImage')}
                        />
                        <button
                          type="button"
                          onClick={() => openMediaModal('defaultImage')}
                          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Select Default Image
                        </button>
                        {defaultImage && (
                          <button
                            type="button"
                            onClick={() => {
                              setValue('defaultImage', '');
                              setDefaultImagePreview('');
                            }}
                            className="ml-2 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        This image will be used when no featured image is available. Recommended size: 1200x630 pixels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Contact Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Contact details displayed on your website.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                        Contact Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="contactEmail"
                          className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.contactEmail ? 'border-red-300' : ''}`}
                          {...register('contactEmail', {
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Please enter a valid email address'
                            }
                          })}
                        />
                        {errors.contactEmail && (
                          <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                        Contact Phone
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="contactPhone"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          {...register('contactPhone')}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="address"
                          rows={3}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          {...register('address')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Social Media Links
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Links to your social media profiles.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="socialFacebook" className="block text-sm font-medium text-gray-700">
                        Facebook
                      </label>
                      <div className="mt-1">
                        <input
                          type="url"
                          id="socialFacebook"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="https://facebook.com/yourpage"
                          {...register('socialFacebook')}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="socialTwitter" className="block text-sm font-medium text-gray-700">
                        Twitter
                      </label>
                      <div className="mt-1">
                        <input
                          type="url"
                          id="socialTwitter"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="https://twitter.com/yourhandle"
                          {...register('socialTwitter')}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="socialInstagram" className="block text-sm font-medium text-gray-700">
                        Instagram
                      </label>
                      <div className="mt-1">
                        <input
                          type="url"
                          id="socialInstagram"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="https://instagram.com/yourprofile"
                          {...register('socialInstagram')}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="socialLinkedin" className="block text-sm font-medium text-gray-700">
                        LinkedIn
                      </label>
                      <div className="mt-1">
                        <input
                          type="url"
                          id="socialLinkedin"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="https://linkedin.com/in/yourprofile"
                          {...register('socialLinkedin')}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="socialYoutube" className="block text-sm font-medium text-gray-700">
                        YouTube
                      </label>
                      <div className="mt-1">
                        <input
                          type="url"
                          id="socialYoutube"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="https://youtube.com/c/yourchannel"
                          {...register('socialYoutube')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Analytics & Tracking
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Integration with analytics and tracking services.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-700">
                        Google Analytics ID
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="googleAnalyticsId"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                          {...register('googleAnalyticsId')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Your Google Analytics tracking ID (starts with G- or UA-).
                      </p>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="facebookPixelId" className="block text-sm font-medium text-gray-700">
                        Facebook Pixel ID
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="facebookPixelId"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="XXXXXXXXXXXXXXXXXX"
                          {...register('facebookPixelId')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Your Facebook Pixel ID for tracking conversions.
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

      {/* Media Library Modal */}
      {showMediaModal && (
        <MediaLibraryModal
          isOpen={showMediaModal}
          onClose={() => setShowMediaModal(false)}
          onSelect={handleMediaSelect}
          mediaType="image"
        />
      )}
    </div>
  );
};

export default GeneralSettings;