import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { footerService } from '../../services/footerService';
import mediaService from '../../services/mediaService';
import MediaLibrary from '../media/MediaLibrary';

const FooterForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    companyInfo: {
      logo: {
        url: '',
        altText: '',
        width: 150,
        height: 60
      },
      description: '',
      address: '',
      phone: '',
      email: ''
    },
    sections: [],
    socialLinks: [],
    newsletter: {
      isEnabled: true,
      title: 'Subscribe to our Newsletter',
      description: 'Get the latest updates and offers.',
      placeholder: 'Enter your email'
    },
    copyright: {
      text: '',
      year: new Date().getFullYear()
    },
    design: {
      backgroundColor: '#1f2937',
      textColor: '#ffffff',
      accentColor: '#3b82f6',
      backgroundImage: '',
      showDecorations: true
    },
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaTarget, setMediaTarget] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchFooter();
    } else {
      // Initialize with default data for new footer
      initializeFooter();
    }
  }, [id, isEdit]);

  const fetchFooter = async () => {
    try {
      setLoading(true);
      const response = await footerService.getFooter();
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching footer:', error);
      toast.error('Failed to fetch footer data');
    } finally {
      setLoading(false);
    }
  };

  const initializeFooter = async () => {
    try {
      setLoading(true);
      const response = await footerService.initializeFooter();
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error initializing footer:', error);
      toast.error('Failed to initialize footer');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, section = null, index = null, field = null, subField = null) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    if (section && index !== null && field && subField) {
      // Handle deeply nested fields (e.g., sections[0].links[0].label)
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].map((item, i) => 
          i === index ? {
            ...item,
            [field]: item[field].map((subItem, j) => 
              j === subField ? { ...subItem, [name]: inputValue } : subItem
            )
          } : item
        )
      }));
    } else if (section && index !== null && field) {
      // Handle nested array items with fields
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].map((item, i) => 
          i === index ? { ...item, [field]: inputValue } : item
        )
      }));
    } else if (section && index !== null) {
      // Handle nested array items
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].map((item, i) => 
          i === index ? { ...item, [name]: inputValue } : item
        )
      }));
    } else if (section && field) {
      // Handle nested objects with sub-fields
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: {
            ...prev[section][field],
            [name]: inputValue
          }
        }
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

  const addSection = () => {
    const newSection = {
      title: '',
      links: [],
      order: formData.sections.length + 1,
      isActive: true
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (index) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const addSectionLink = (sectionIndex) => {
    const newLink = {
      label: '',
      href: '',
      order: formData.sections[sectionIndex].links.length + 1,
      isActive: true
    };
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, links: [...section.links, newLink] }
          : section
      )
    }));
  };

  const removeSectionLink = (sectionIndex, linkIndex) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, links: section.links.filter((_, j) => j !== linkIndex) }
          : section
      )
    }));
  };

  const addSocialLink = () => {
    const newSocialLink = {
      platform: '',
      url: '',
      icon: '',
      order: formData.socialLinks.length + 1,
      isActive: true
    };
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newSocialLink]
    }));
  };

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleMediaSelect = (media) => {
    if (mediaTarget === 'logo') {
      setFormData(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          logo: {
            ...prev.companyInfo.logo,
            url: media.url
          }
        }
      }));
    } else if (mediaTarget === 'background') {
      setFormData(prev => ({
        ...prev,
        design: {
          ...prev.design,
          backgroundImage: media.url
        }
      }));
    } else if (mediaTarget && mediaTarget.startsWith('social-')) {
      const socialIndex = parseInt(mediaTarget.split('-')[1]);
      const updatedLinks = [...formData.socialLinks];
      updatedLinks[socialIndex] = { ...updatedLinks[socialIndex], url: media.url };
      setFormData(prev => ({
        ...prev,
        socialLinks: updatedLinks
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
        response = await footerService.updateFooter(formData._id, formData);
      } else {
        response = await footerService.createFooter(formData);
      }
      
      if (response.data.success) {
        toast.success(`Footer ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/footer');
      }
    } catch (error) {
      console.error('Error saving footer:', error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} footer`);
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
            {isEdit ? 'Edit Footer' : 'Create Footer'}
          </h1>
          <button
            type="button"
            onClick={() => navigate('/footer')}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Info Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Company Information</h2>
            
            {/* Logo */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3">Logo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <div className="mt-1 flex items-center">
                    {formData.companyInfo.logo.url ? (
                      <div className="relative">
                        <img
                          src={formData.companyInfo.logo.url}
                          alt="Company Logo"
                          className="h-32 w-32 object-contain rounded-md border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              companyInfo: {
                                ...prev.companyInfo,
                                logo: {
                                  ...prev.companyInfo.logo,
                                  url: ''
                                }
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
                      {formData.companyInfo.logo.url ? 'Change' : 'Select'} Logo
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
                    value={formData.companyInfo.logo.altText}
                    onChange={(e) => handleInputChange(e, 'companyInfo', null, 'logo')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.companyInfo.description}
                  onChange={(e) => handleInputChange(e, 'companyInfo')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.companyInfo.address}
                  onChange={(e) => handleInputChange(e, 'companyInfo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.companyInfo.phone}
                  onChange={(e) => handleInputChange(e, 'companyInfo')}
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
                  value={formData.companyInfo.email}
                  onChange={(e) => handleInputChange(e, 'companyInfo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          <div className="border-b pb-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Footer Sections</h3>
                  <p className="text-sm text-gray-600 mt-1">Organize your footer content into sections with links</p>
                </div>
                <button
                  type="button"
                  onClick={addSection}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Section
                </button>
              </div>
            </div>
            
            {formData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {sectionIndex + 1}
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Footer Section {sectionIndex + 1}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                    title="Remove this section"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={section.title}
                    onChange={(e) => handleInputChange(e, 'sections', sectionIndex)}
                    placeholder="Enter section title (e.g., Quick Links, Services, About)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-800">Section Links</h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {section.links?.length || 0} links
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addSectionLink(sectionIndex)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Link
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Add navigation links that will appear under this section in the footer.</p>
                  </div>
                  
                  {section.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {linkIndex + 1}
                          </div>
                          <span className="text-sm font-medium text-gray-700">Link {linkIndex + 1}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSectionLink(sectionIndex, linkIndex)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                          title="Remove this link"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Link Text <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => {
                              const newLinks = [...section.links];
                              newLinks[linkIndex] = { ...newLinks[linkIndex], label: e.target.value };
                              setFormData(prev => ({
                                ...prev,
                                sections: prev.sections.map((sec, i) => 
                                  i === sectionIndex ? { ...sec, links: newLinks } : sec
                                )
                              }));
                            }}
                            placeholder="e.g., About Us, Contact, Privacy Policy"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            URL <span className="text-red-500">*</span>
                          </label>
                          <input
                              type="url"
                              value={link.href}
                              onChange={(e) => {
                                const newLinks = [...section.links];
                                newLinks[linkIndex] = { ...newLinks[linkIndex], href: e.target.value };
                                setFormData(prev => ({
                                  ...prev,
                                  sections: prev.sections.map((sec, i) => 
                                    i === sectionIndex ? { ...sec, links: newLinks } : sec
                                  )
                                }));
                              }}
                              placeholder="https://example.com या /about-us"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                              title="कृपया valid URL enter करें (जैसे: https://example.com या /page-name)"
                            />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={link.isActive}
                            onChange={(e) => {
                              const newLinks = [...section.links];
                              newLinks[linkIndex] = { ...newLinks[linkIndex], isActive: e.target.checked };
                              setFormData(prev => ({
                                ...prev,
                                sections: prev.sections.map((sec, i) => 
                                  i === sectionIndex ? { ...sec, links: newLinks } : sec
                                )
                              }));
                            }}
                            className="mr-2 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="font-medium">Active Link</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={section.isActive}
                    onChange={(e) => handleInputChange(e, 'sections', sectionIndex)}
                    className="mr-2"
                  />
                  Section Active
                </label>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="border-b pb-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
                  <p className="text-sm text-gray-600 mt-1">Add social media platforms to connect with your audience</p>
                </div>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Social Link
                </button>
              </div>
            </div>
            
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Social Link {index + 1}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                    title="Remove this social link"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="platform"
                      value={link.platform}
                      onChange={(e) => handleInputChange(e, 'socialLinks', index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      placeholder="e.g., Facebook, Twitter, Instagram"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Media Icon <span className="text-red-500">*</span>
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
                              const updatedLinks = [...formData.socialLinks];
                              updatedLinks[index] = { ...updatedLinks[index], url: '' };
                              setFormData(prev => ({
                                ...prev,
                                socialLinks: updatedLinks
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
                        className="ml-3 bg-purple-600 py-2 px-3 border border-purple-600 rounded-lg shadow-sm text-sm leading-4 font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
                      >
                        {link.url ? 'Change' : 'Select'} Icon
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Select an icon for {link.platform || 'this social platform'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon Class
                    </label>
                    <input
                      type="text"
                      name="icon"
                      value={link.icon}
                      onChange={(e) => handleInputChange(e, 'socialLinks', index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      placeholder="fab fa-facebook-f"
                    />
                    <p className="text-xs text-gray-500 mt-1">FontAwesome icon class (optional)</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={link.isActive}
                      onChange={(e) => handleInputChange(e, 'socialLinks', index)}
                      className="mr-2 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="font-medium">Active Link</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Newsletter</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="isEnabled"
                    checked={formData.newsletter.isEnabled}
                    onChange={(e) => handleInputChange(e, 'newsletter')}
                    className="mr-2"
                  />
                  Enable Newsletter
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.newsletter.title}
                  onChange={(e) => handleInputChange(e, 'newsletter')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.newsletter.description}
                  onChange={(e) => handleInputChange(e, 'newsletter')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  name="placeholder"
                  value={formData.newsletter.placeholder}
                  onChange={(e) => handleInputChange(e, 'newsletter')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Copyright</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Copyright Text
                </label>
                <input
                  type="text"
                  name="text"
                  value={formData.copyright.text}
                  onChange={(e) => handleInputChange(e, 'copyright')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="© 2024 Your Company. All rights reserved."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.copyright.year}
                  onChange={(e) => handleInputChange(e, 'copyright')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Design Settings */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Design Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  name="backgroundColor"
                  value={formData.design.backgroundColor}
                  onChange={(e) => handleInputChange(e, 'design')}
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
                  value={formData.design.textColor}
                  onChange={(e) => handleInputChange(e, 'design')}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accent Color
                </label>
                <input
                  type="color"
                  name="accentColor"
                  value={formData.design.accentColor}
                  onChange={(e) => handleInputChange(e, 'design')}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="backgroundImage"
                    value={formData.design.backgroundImage}
                    onChange={(e) => handleInputChange(e, 'design')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTarget('background');
                      setShowMediaLibrary(true);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Browse
                  </button>
                </div>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="showDecorations"
                    checked={formData.design.showDecorations}
                    onChange={(e) => handleInputChange(e, 'design')}
                    className="mr-2"
                  />
                  Show Decorations
                </label>
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
              onClick={() => navigate('/footer')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Footer' : 'Create Footer')}
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

export default FooterForm;