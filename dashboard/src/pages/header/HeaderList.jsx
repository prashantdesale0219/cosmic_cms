import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { headerService } from '../../services/headerService';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiEyeOff } from 'react-icons/fi';

const HeaderList = () => {
  const [header, setHeader] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeader();
  }, []);

  const fetchHeader = async () => {
    try {
      setLoading(true);
      const response = await headerService.getHeader();
      if (response.data.success) {
        setHeader(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching header:', error);
      if (error.response?.status === 404) {
        // No header exists, initialize one
        await initializeHeader();
      } else {
        toast.error('Failed to fetch header data');
      }
    } finally {
      setLoading(false);
    }
  };

  const initializeHeader = async () => {
    try {
      const response = await headerService.initializeHeader();
      if (response.data.success) {
        setHeader(response.data.data);
        toast.success('Header initialized with default data');
      }
    } catch (error) {
      console.error('Error initializing header:', error);
      toast.error('Failed to initialize header');
    }
  };

  const toggleHeaderStatus = async () => {
    try {
      const updatedHeader = {
        ...header,
        isActive: !header.isActive
      };
      
      const response = await headerService.updateHeader(header._id, updatedHeader);
      if (response.data.success) {
        setHeader(response.data.data);
        toast.success(`Header ${updatedHeader.isActive ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      console.error('Error updating header status:', error);
      toast.error('Failed to update header status');
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Header Management</h1>
              <p className="text-gray-600 mt-1">Manage your website header configuration</p>
            </div>
            <div className="flex space-x-3">
              {!header && (
                <button
                  onClick={initializeHeader}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <FiPlus className="mr-2" />
                  Initialize Header
                </button>
              )}
            </div>
          </div>
        </div>

        {header ? (
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mr-4">Current Header Configuration</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      header.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {header.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Logo Section */}
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-900 mb-3">Logo</h3>
                      {header.logo?.url ? (
                        <div>
                          <img 
                            src={header.logo.url} 
                            alt={header.logo.altText || 'Logo'}
                            className="h-12 object-contain mb-2"
                          />
                          <p className="text-sm text-gray-600">
                            {header.logo.width}x{header.logo.height}px
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No logo configured</p>
                      )}
                    </div>

                    {/* Navigation Section */}
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-900 mb-3">Navigation</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {header.navigation?.length || 0} menu items
                      </p>
                      <div className="space-y-1">
                        {header.navigation?.slice(0, 3).map((item, index) => (
                          <div key={index} className="text-sm text-gray-700">
                            • {item.label}
                            {item.submenu?.length > 0 && (
                              <span className="text-gray-500 ml-1">({item.submenu.length} sub)</span>
                            )}
                          </div>
                        ))}
                        {header.navigation?.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{header.navigation.length - 3} more...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Top Bar Section */}
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-900 mb-3">Top Bar</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            header.topBar?.isVisible ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          {header.topBar?.isVisible ? 'Visible' : 'Hidden'}
                        </div>
                        {header.topBar?.address && (
                          <p className="text-gray-600">📍 {header.topBar.address}</p>
                        )}
                        {header.topBar?.email && (
                          <p className="text-gray-600">✉️ {header.topBar.email}</p>
                        )}
                        {header.topBar?.socialLinks?.length > 0 && (
                          <p className="text-gray-600">
                            🔗 {header.topBar.socialLinks.length} social links
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Settings Section */}
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-900 mb-3">Settings</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            header.settings?.isSticky ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          {header.settings?.isSticky ? 'Sticky' : 'Static'}
                        </div>
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            header.settings?.showTopBar ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          Top Bar: {header.settings?.showTopBar ? 'Enabled' : 'Disabled'}
                        </div>
                        {header.settings?.backgroundColor && (
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded mr-2 border"
                              style={{ backgroundColor: header.settings.backgroundColor }}
                            ></div>
                            Background
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Last Updated */}
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-900 mb-3">Last Updated</h3>
                      <p className="text-sm text-gray-600">
                        {header.updatedAt ? new Date(header.updatedAt).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  onClick={toggleHeaderStatus}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
                    header.isActive 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {header.isActive ? (
                    <>
                      <FiEyeOff className="mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <FiEye className="mr-2" />
                      Activate
                    </>
                  )}
                </button>
                
                <Link
                  to={`/header/edit/${header._id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FiEdit className="mr-2" />
                  Edit Header
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Header Configuration</h3>
              <p className="text-gray-600 mb-6">Get started by initializing your header with default settings.</p>
              <button
                onClick={initializeHeader}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FiPlus className="mr-2" />
                Initialize Header
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderList;