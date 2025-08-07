import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { headerService } from '../../services/headerService';
import mediaService from '../../services/mediaService';
import MediaLibrary from '../media/MediaLibrary';

const HeaderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    topBar: {
      isVisible: true,
      address: '',
      email: '',
      socialLinks: []
    },
    logo: {
      url: '',
      altText: '',
      width: 150,
      height: 60
    },
    navigation: [],
    settings: {
      isSticky: true,
      backgroundColor: '#ffffff',
      textColor: '#333333',
      showTopBar: true
    },
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaTarget, setMediaTarget] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchHeader();
    } else {
      // Initialize with default data for new header
      initializeHeader();
    }
  }, [id, isEdit]);

  const fetchHeader = async () => {
    try {
      setLoading(true);
      const response = await headerService.getHeader();
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching header:', error);
      toast.error('Failed to fetch header data');
    } finally {
      setLoading(false);
    }
  };

  const initializeHeader = async () => {
    try {
      setLoading(true);
      const response = await headerService.initializeHeader();
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error initializing header:', error);
      toast.error('Failed to initialize header');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, section = null, index = null, field = null) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    if (section && index !== null && field) {
      // Handle nested array items
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].map((item, i) => 
          i === index ? { ...item, [field]: inputValue } : item
        )
      }));
    } else if (section) {
      // Handle nested objects
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: inputValue
        }
      }));
    } else {
      // Handle top-level fields
      setFormData(prev => ({
        ...prev,
        [name]: inputValue
      }));
    }
  };

  const addNavigationItem = () => {
    const newItem = {
      label: '',
      href: '#',
      order: formData.navigation.length + 1,
      isActive: true,
      submenu: []
    };
    setFormData(prev => ({
      ...prev,
      navigation: [...prev.navigation, newItem]
    }));
  };

  const removeNavigationItem = (index) => {
    setFormData(prev => ({
      ...prev,
      navigation: prev.navigation.filter((_, i) => i !== index)
    }));
  };

  const addSubmenuItem = (navIndex) => {
    const newSubmenuItem = {
      label: '',
      href: '#',
      order: formData.navigation[navIndex].submenu.length + 1,
      isActive: true
    };
    setFormData(prev => ({
      ...prev,
      navigation: prev.navigation.map((item, i) => 
        i === navIndex 
          ? { ...item, submenu: [...item.submenu, newSubmenuItem] }
          : item
      )
    }));
  };

  const removeSubmenuItem = (navIndex, submenuIndex) => {
    setFormData(prev => ({
      ...prev,
      navigation: prev.navigation.map((item, i) => 
        i === navIndex 
          ? { ...item, submenu: item.submenu.filter((_, j) => j !== submenuIndex) }
          : item
      )
    }));
  };

  const addSocialLink = () => {
    const newSocialLink = {
      platform: '',
      url: '',
      icon: '',
      order: formData.topBar.socialLinks.length + 1,
      isActive: true
    };
    setFormData(prev => ({
      ...prev,
      topBar: {
        ...prev.topBar,
        socialLinks: [...prev.topBar.socialLinks, newSocialLink]
      }
    }));
  };

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      topBar: {
        ...prev.topBar,
        socialLinks: prev.topBar.socialLinks.filter((_, i) => i !== index)
      }
    }));
  };

  const handleMediaSelect = (media) => {
    if (mediaTarget === 'logo') {
      setFormData(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          url: media.url
        }
      }));
    } else if (mediaTarget && mediaTarget.startsWith('social-')) {
      const socialIndex = parseInt(mediaTarget.split('-')[1]);
      const updatedLinks = [...formData.topBar.socialLinks];
      updatedLinks[socialIndex] = { ...updatedLinks[socialIndex], url: media.url };
      setFormData(prev => ({
        ...prev,
        topBar: {
          ...prev.topBar,
          socialLinks: updatedLinks
        }
      }));
    }
    setShowMediaLibrary(false);
    setMediaTarget('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      let response;
      if (isEdit) {
        response = await headerService.updateHeader(formData._id, formData);
      } else {
        response = await headerService.createHeader(formData);
      }
      
      if (response.data.success) {
        toast.success(`Header ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/header');
      }
    } catch (error) {
      console.error('Error saving header:', error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} header`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Header' : 'Create Header'}
          </h1>
          <button
            type="button"
            onClick={() => navigate('/header')}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Top Bar Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Top Bar Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isVisible"
                    checked={formData.topBar.isVisible}
                    onChange={(e) => handleInputChange(e, 'topBar')}
                    className="mr-2"
                  />
                  Show Top Bar
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.topBar.address}
                  onChange={(e) => handleInputChange(e, 'topBar')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.topBar.email}
                  onChange={(e) => handleInputChange(e, 'topBar')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Social Links</h3>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Social Link
                </button>
              </div>
              
              {formData.topBar.socialLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform
                    </label>
                    <input
                      type="text"
                      value={link.platform}
                      onChange={(e) => handleInputChange(e, 'topBar', index, 'platform')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Facebook, Twitter, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Media Icon
                    </label>
                    <div className="mt-1 flex items-center">
                      {link.url ? (
                        <div className="relative">
                          <img
                            src={link.url}
                            alt={`${link.platform} Icon`}
                            className="h-16 w-16 object-contain rounded-md border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedLinks = [...formData.topBar.socialLinks];
                              updatedLinks[index] = { ...updatedLinks[index], url: '' };
                              setFormData(prev => ({
                                ...prev,
                                topBar: {
                                  ...prev.topBar,
                                  socialLinks: updatedLinks
                                }
                              }));
                            }}
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setMediaTarget(`social-${index}`);
                            setShowMediaLibrary(true);
                          }}
                          className="h-16 w-16 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setMediaTarget(`social-${index}`);
                          setShowMediaLibrary(true);
                        }}
                        className="ml-3 bg-blue-600 py-2 px-3 border border-blue-600 rounded-lg shadow-sm text-sm leading-4 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                      >
                        {link.url ? 'Change' : 'Select'} Icon
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Select an icon for {link.platform || 'this social platform'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon Class
                    </label>
                    <input
                      type="text"
                      value={link.icon}
                      onChange={(e) => handleInputChange(e, 'topBar', index, 'icon')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="fab fa-facebook"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Logo Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <div className="mt-1 flex items-center">
                    {formData.logo.url ? (
                      <div className="relative">
                        <img
                          src={formData.logo.url}
                          alt="Company Logo"
                          className="h-32 w-32 object-contain rounded-md border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              logo: {
                                ...prev.logo,
                                url: ''
                              }
                            }));
                          }}
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setMediaTarget('logo');
                          setShowMediaLibrary(true);
                        }}
                        className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
                      >
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget('logo');
                        setShowMediaLibrary(true);
                      }}
                      className="ml-5 bg-blue-600 py-2 px-4 border border-blue-600 rounded-lg shadow-sm text-sm leading-4 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                    >
                      {formData.logo.url ? 'Change' : 'Select'} Logo
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Select your company logo from the media library
                  </p>
                </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  name="altText"
                  value={formData.logo.altText}
                  onChange={(e) => handleInputChange(e, 'logo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  name="width"
                  value={formData.logo.width}
                  onChange={(e) => handleInputChange(e, 'logo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.logo.height}
                  onChange={(e) => handleInputChange(e, 'logo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Navigation Menu</h2>
              <button
                type="button"
                onClick={addNavigationItem}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Add Menu Item
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Manage your website's main navigation menu items and their submenus.</p>
            
            {formData.navigation.map((navItem, navIndex) => (
              <div key={navIndex} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{navIndex + 1}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Navigation Item {navIndex + 1}</h4>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Menu Label *
                    </label>
                    <input
                      type="text"
                      value={navItem.label}
                      onChange={(e) => handleInputChange(e, 'navigation', navIndex, 'label')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Home, About, Services"
                      required
                    />
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={navItem.isActive}
                        onChange={(e) => handleInputChange(e, 'navigation', navIndex, 'isActive')}
                        className="mr-2"
                      />
                      Active
                    </label>
                    <button
                      type="button"
                      onClick={() => removeNavigationItem(navIndex)}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                {/* Submenu */}
                <div className="ml-4">
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-800">Submenu Items</h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {navItem.submenu?.length || 0} items
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addSubmenuItem(navIndex)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                      >
                        Add Submenu
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Add dropdown menu items that appear when users hover over this navigation item.</p>
                  </div>
                  
                  {navItem.submenu.map((subItem, subIndex) => (
                    <div key={subIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 p-2 bg-gray-50 rounded">
                      <div>
                        <input
                          type="text"
                          value={subItem.label}
                          onChange={(e) => {
                            const newSubmenu = [...navItem.submenu];
                            newSubmenu[subIndex] = { ...newSubmenu[subIndex], label: e.target.value };
                            setFormData(prev => ({
                              ...prev,
                              navigation: prev.navigation.map((item, i) => 
                                i === navIndex ? { ...item, submenu: newSubmenu } : item
                              )
                            }));
                          }}
                          placeholder="Submenu label"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={subItem.isActive}
                            onChange={(e) => {
                              const newSubmenu = [...navItem.submenu];
                              newSubmenu[subIndex] = { ...newSubmenu[subIndex], isActive: e.target.checked };
                              setFormData(prev => ({
                                ...prev,
                                navigation: prev.navigation.map((item, i) => 
                                  i === navIndex ? { ...item, submenu: newSubmenu } : item
                                )
                              }));
                            }}
                            className="mr-1"
                          />
                          Active
                        </label>
                        <button
                          type="button"
                          onClick={() => removeSubmenuItem(navIndex, subIndex)}
                          className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Settings Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Header Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isSticky"
                    checked={formData.settings.isSticky}
                    onChange={(e) => handleInputChange(e, 'settings')}
                    className="mr-2"
                  />
                  Sticky Header
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="showTopBar"
                    checked={formData.settings.showTopBar}
                    onChange={(e) => handleInputChange(e, 'settings')}
                    className="mr-2"
                  />
                  Show Top Bar
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  name="backgroundColor"
                  value={formData.settings.backgroundColor}
                  onChange={(e) => handleInputChange(e, 'settings')}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <input
                  type="color"
                  name="textColor"
                  value={formData.settings.textColor}
                  onChange={(e) => handleInputChange(e, 'settings')}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              Active
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/header')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Header' : 'Create Header')}
            </button>
          </div>
        </form>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Media</h3>
              <button
                onClick={() => setShowMediaLibrary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <MediaLibrary onSelect={handleMediaSelect} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderForm;