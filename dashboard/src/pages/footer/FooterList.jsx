import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { footerService } from '../../services/footerService';

const FooterList = () => {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      setLoading(true);
      const response = await footerService.getFooter();
      if (response.data.success) {
        setFooter(response.data.data);
      } else {
        // If no footer exists, initialize one
        await initializeFooter();
      }
    } catch (error) {
      console.error('Error fetching footer:', error);
      // Try to initialize footer if it doesn't exist
      await initializeFooter();
    } finally {
      setLoading(false);
    }
  };

  const initializeFooter = async () => {
    try {
      const response = await footerService.initializeFooter();
      if (response.data.success) {
        setFooter(response.data.data);
        toast.success('Footer initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing footer:', error);
      toast.error('Failed to initialize footer');
    }
  };

  const toggleFooterStatus = async () => {
    if (!footer) return;
    
    try {
      setUpdating(true);
      const updatedFooter = { ...footer, isActive: !footer.isActive };
      const response = await footerService.updateFooter(footer._id, updatedFooter);
      
      if (response.data.success) {
        setFooter(response.data.data);
        toast.success(`Footer ${footer.isActive ? 'deactivated' : 'activated'} successfully`);
      }
    } catch (error) {
      console.error('Error updating footer status:', error);
      toast.error('Failed to update footer status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!footer) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Footer Found</h2>
          <p className="text-gray-600 mb-6">No footer configuration exists. Create one to get started.</p>
          <button
            onClick={initializeFooter}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Initialize Footer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Footer Management</h1>
              <p className="text-gray-600 mt-1">Manage your website's footer content and settings</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={toggleFooterStatus}
                disabled={updating}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  footer.isActive
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                } disabled:opacity-50`}
              >
                {updating ? 'Updating...' : (footer.isActive ? 'Deactivate' : 'Activate')}
              </button>
              <Link
                to={`/footer/edit/${footer._id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Footer
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Preview */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                {footer.companyInfo.logo.url && (
                  <div className="mb-4">
                    <img
                      src={footer.companyInfo.logo.url}
                      alt={footer.companyInfo.logo.altText || 'Company Logo'}
                      className="h-12 object-contain"
                    />
                  </div>
                )}
                
                {footer.companyInfo.description && (
                  <p className="text-gray-600 mb-3">{footer.companyInfo.description}</p>
                )}
                
                <div className="space-y-2 text-sm text-gray-600">
                  {footer.companyInfo.address && (
                    <div className="flex items-start">
                      <span className="font-medium mr-2">Address:</span>
                      <span>{footer.companyInfo.address}</span>
                    </div>
                  )}
                  {footer.companyInfo.phone && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Phone:</span>
                      <span>{footer.companyInfo.phone}</span>
                    </div>
                  )}
                  {footer.companyInfo.email && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Email:</span>
                      <span>{footer.companyInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Sections */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Footer Sections</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                {footer.sections && footer.sections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {footer.sections
                      .filter(section => section.isActive)
                      .map((section, index) => (
                        <div key={index} className="">
                          <h3 className="font-medium text-gray-900 mb-2">{section.title}</h3>
                          <ul className="space-y-1">
                            {section.links
                              .filter(link => link.isActive)
                              .map((link, linkIndex) => (
                                <li key={linkIndex}>
                                  <span className="text-sm text-gray-600">{link.label}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No footer sections configured</p>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                {footer.socialLinks && footer.socialLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {footer.socialLinks
                      .filter(link => link.isActive)
                      .map((link, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md">
                          {link.icon && (
                            <i className={`${link.icon} text-gray-600`}></i>
                          )}
                          <span className="text-sm font-medium">{link.platform}</span>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No social links configured</p>
                )}
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Newsletter</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                {footer.newsletter.isEnabled ? (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{footer.newsletter.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{footer.newsletter.description}</p>
                    <div className="flex">
                      <input
                        type="email"
                        placeholder={footer.newsletter.placeholder}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm"
                        disabled
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md text-sm" disabled>
                        Subscribe
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Newsletter is disabled</p>
                )}
              </div>
            </div>

            {/* Design Settings */}
            <div className="space-y-4 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900">Design Settings</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Background</span>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-6 h-6 rounded border mr-2"
                        style={{ backgroundColor: footer.design.backgroundColor }}
                      ></div>
                      <span className="text-sm text-gray-600">{footer.design.backgroundColor}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Text Color</span>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-6 h-6 rounded border mr-2"
                        style={{ backgroundColor: footer.design.textColor }}
                      ></div>
                      <span className="text-sm text-gray-600">{footer.design.textColor}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Accent Color</span>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-6 h-6 rounded border mr-2"
                        style={{ backgroundColor: footer.design.accentColor }}
                      ></div>
                      <span className="text-sm text-gray-600">{footer.design.accentColor}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Decorations</span>
                    <div className="mt-1">
                      <span className={`text-sm px-2 py-1 rounded ${
                        footer.design.showDecorations 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {footer.design.showDecorations ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Status and Meta */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    footer.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {footer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {footer.copyright.text && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">Copyright:</span>
                    <span className="text-sm text-gray-600">{footer.copyright.text}</span>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-500">
                Last updated: {new Date(footer.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterList;