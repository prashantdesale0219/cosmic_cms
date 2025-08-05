import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSave } from 'react-icons/fa';
import api from '../../services/api';

const DirectorCTA = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ctaData, setCtaData] = useState(null);
  const [formData, setFormData] = useState({
    title: 'Join Us in Our Solar Mission',
    description: 'Whether you\'re looking to power your home, business, or join our team, we invite you to be part of our journey towards a sustainable future.',
    primaryButton: {
      text: 'Contact Us',
      url: '/contact'
    },
    secondaryButton: {
      text: 'Join Our Team',
      url: '/careers'
    },
    backgroundColor: 'bg-primary-600',
    isActive: true
  });

  const backgroundOptions = [
    { value: 'bg-primary-600', label: 'Primary Blue', preview: 'bg-blue-600' },
    { value: 'bg-gray-900', label: 'Dark Gray', preview: 'bg-gray-900' },
    { value: 'bg-green-600', label: 'Green', preview: 'bg-green-600' },
    { value: 'bg-purple-600', label: 'Purple', preview: 'bg-purple-600' },
    { value: 'bg-indigo-600', label: 'Indigo', preview: 'bg-indigo-600' },
    { value: 'bg-red-600', label: 'Red', preview: 'bg-red-600' }
  ];

  useEffect(() => {
    fetchCtaData();
  }, []);

  const fetchCtaData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/director/cta');
      if (response.data.data.cta) {
        setCtaData(response.data.data.cta);
        setFormData(response.data.data.cta);
      }
    } catch (error) {
      console.error('Error fetching CTA data:', error);
      // If no CTA data exists, we'll use the default formData
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

  const handleButtonChange = (buttonType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [buttonType]: {
        ...prev[buttonType],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.primaryButton.text.trim()) {
      toast.error('Primary button text is required');
      return;
    }
    if (!formData.primaryButton.url.trim()) {
      toast.error('Primary button URL is required');
      return;
    }

    try {
      setSaving(true);
      
      if (ctaData) {
        // Update existing CTA
        await api.patch(`/director/cta/${ctaData._id}`, formData);
        toast.success('CTA section updated successfully');
      } else {
        // Create new CTA
        const response = await api.post('/director/cta', formData);
        setCtaData(response.data.data.cta);
        toast.success('CTA section created successfully');
      }
      
      fetchCtaData();
    } catch (error) {
      console.error('Error saving CTA data:', error);
      toast.error(error.response?.data?.message || 'Failed to save CTA section');
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
        <h1 className="text-2xl font-bold text-gray-900">Director CTA Section</h1>
        <p className="text-gray-600 mt-1">Manage the call-to-action section of the Director's Desk page</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
            
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
                  placeholder="Enter CTA title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter CTA description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {backgroundOptions.map((option) => (
                    <label key={option.value} className="flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="backgroundColor"
                        value={option.value}
                        checked={formData.backgroundColor === option.value}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <div className={`w-4 h-4 rounded ${option.preview} mr-2`}></div>
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
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

          {/* Buttons */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Buttons</h2>
            
            <div className="space-y-6">
              {/* Primary Button */}
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3">Primary Button</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text *
                    </label>
                    <input
                      type="text"
                      value={formData.primaryButton.text}
                      onChange={(e) => handleButtonChange('primaryButton', 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contact Us"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button URL *
                    </label>
                    <input
                      type="text"
                      value={formData.primaryButton.url}
                      onChange={(e) => handleButtonChange('primaryButton', 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="/contact"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Button */}
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3">Secondary Button</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.secondaryButton.text}
                      onChange={(e) => handleButtonChange('secondaryButton', 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Join Our Team"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button URL
                    </label>
                    <input
                      type="text"
                      value={formData.secondaryButton.url}
                      onChange={(e) => handleButtonChange('secondaryButton', 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="/careers"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          <div className={`${formData.backgroundColor.replace('bg-primary-600', 'bg-blue-600')} text-white p-8 rounded-lg`}>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">{formData.title}</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                {formData.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {formData.primaryButton.text && (
                  <button className="bg-yellow-500 text-black px-8 py-4 rounded-full font-semibold shadow-lg">
                    {formData.primaryButton.text}
                  </button>
                )}
                {formData.secondaryButton.text && (
                  <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold">
                    {formData.secondaryButton.text}
                  </button>
                )}
              </div>
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
            {saving ? 'Saving...' : (ctaData ? 'Update CTA Section' : 'Create CTA Section')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DirectorCTA;