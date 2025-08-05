import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import api from '../../services/api';

const DirectorHero = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [formData, setFormData] = useState({
    title: "Director's Desk",
    subtitle: 'Meet Our Leadership Team',
    backgroundVideo: '/directordesk.mp4',
    backgroundImage: '',
    breadcrumbs: [
      { label: 'Home', url: '/', isActive: false },
      { label: 'About', url: '/about', isActive: false },
      { label: "Director's Desk", url: '/director-desk', isActive: true }
    ],
    isActive: true
  });

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/director/hero');
      if (response.data.data.hero) {
        setHeroData(response.data.data.hero);
        setFormData(response.data.data.hero);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      // If no hero data exists, we'll use the default formData
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBreadcrumbChange = (index, field, value) => {
    const updatedBreadcrumbs = [...formData.breadcrumbs];
    updatedBreadcrumbs[index] = { ...updatedBreadcrumbs[index], [field]: value };
    setFormData(prev => ({ ...prev, breadcrumbs: updatedBreadcrumbs }));
  };

  const addBreadcrumb = () => {
    setFormData(prev => ({
      ...prev,
      breadcrumbs: [...prev.breadcrumbs, { label: '', url: '', isActive: false }]
    }));
  };

  const removeBreadcrumb = (index) => {
    if (formData.breadcrumbs.length > 1) {
      const updatedBreadcrumbs = formData.breadcrumbs.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, breadcrumbs: updatedBreadcrumbs }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setSaving(true);
      
      if (heroData) {
        // Update existing hero
        await api.patch(`/director/hero/${heroData._id}`, formData);
        toast.success('Hero section updated successfully');
      } else {
        // Create new hero
        const response = await api.post('/director/hero', formData);
        setHeroData(response.data.data.hero);
        toast.success('Hero section created successfully');
      }
      
      fetchHeroData();
    } catch (error) {
      console.error('Error saving hero data:', error);
      toast.error(error.response?.data?.message || 'Failed to save hero section');
    } finally {
      setSaving(false);
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Director Hero Section</h1>
        <p className="text-gray-600 mt-1">Manage the hero section of the Director's Desk page</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter hero title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter hero subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Video URL
                </label>
                <input
                  type="text"
                  name="backgroundVideo"
                  value={formData.backgroundVideo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/directordesk.mp4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image URL (Fallback)
                </label>
                <input
                  type="url"
                  name="backgroundImage"
                  value={formData.backgroundImage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Breadcrumbs</h2>
              <button
                type="button"
                onClick={addBreadcrumb}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
              >
                <FaPlus className="w-3 h-3" />
                Add Breadcrumb
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.breadcrumbs.map((breadcrumb, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={breadcrumb.label}
                      onChange={(e) => handleBreadcrumbChange(index, 'label', e.target.value)}
                      placeholder="Label"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      value={breadcrumb.url}
                      onChange={(e) => handleBreadcrumbChange(index, 'url', e.target.value)}
                      placeholder="URL"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={breadcrumb.isActive}
                        onChange={(e) => handleBreadcrumbChange(index, 'isActive', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                    {formData.breadcrumbs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBreadcrumb(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="bg-gray-900 text-white p-8 rounded-lg relative overflow-hidden">
            {formData.backgroundVideo && (
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
              </div>
            )}
            <div className="relative z-10 text-center">
              <h1 className="text-4xl font-bold mb-4">{formData.title}</h1>
              {formData.subtitle && (
                <p className="text-xl text-gray-300 mb-6">{formData.subtitle}</p>
              )}
              <nav className="flex items-center justify-center space-x-2 text-sm">
                {formData.breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={index}>
                    <span className={breadcrumb.isActive ? 'text-yellow-400' : 'text-gray-300'}>
                      {breadcrumb.label}
                    </span>
                    {index < formData.breadcrumbs.length - 1 && (
                      <span className="text-gray-400">—</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave className="w-4 h-4" />
            {saving ? 'Saving...' : (heroData ? 'Update Hero Section' : 'Create Hero Section')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DirectorHero;