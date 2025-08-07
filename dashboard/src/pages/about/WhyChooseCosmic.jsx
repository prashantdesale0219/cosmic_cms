import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { aboutService } from '../../services/api';

const WhyChooseCosmic = () => {
  const [whyChooseCosmic, setWhyChooseCosmic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingFeature, setEditingFeature] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    highlightText: '',
    features: [],
    isActive: true
  });
  const [featureFormData, setFeatureFormData] = useState({
    title: '',
    description: '',
    icon: '',
    isActive: true
  });

  useEffect(() => {
    fetchWhyChooseCosmic();
  }, []);

  const fetchWhyChooseCosmic = async () => {
    try {
      const response = await aboutService.getWhyChooseCosmic();
      console.log('Why Choose Cosmic API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // Check if response has status success and data property
        if (response.data.status === 'success' && response.data.data && response.data.data.whyChooseCosmic) {
          setWhyChooseCosmic(response.data.data.whyChooseCosmic);
        }
        // Check if response.data directly contains whyChooseCosmic
        else if (response.data.whyChooseCosmic) {
          setWhyChooseCosmic(response.data.whyChooseCosmic);
        }
        // Check if response.data is the whyChooseCosmic object itself
        else if (response.data.title) {
          setWhyChooseCosmic(response.data);
        }
        // Fallback: try to get from nested structure
        else if (response.data.data && response.data.data.title) {
          setWhyChooseCosmic(response.data.data);
        }
        else {
          console.warn('Unexpected response format:', response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching why choose cosmic data:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch why choose cosmic data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        const response = await aboutService.updateWhyChooseCosmic(formData);
        setWhyChooseCosmic(response.data.data);
        toast.success('Why choose cosmic updated successfully!');
      } else {
        const response = await aboutService.createWhyChooseCosmic(formData);
        setWhyChooseCosmic(response.data.data);
        toast.success('Why choose cosmic created successfully!');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingFeature) {
        // Update existing feature
        const updatedFeatures = whyChooseCosmic.features.map(feature => 
          feature._id === editingFeature._id ? { ...feature, ...featureFormData } : feature
        );
        const response = await api.patch(`/about/why-choose-cosmic/${whyChooseCosmic._id}`, {
          ...whyChooseCosmic,
          features: updatedFeatures
        });
        setWhyChooseCosmic(response.data.data.whyChooseCosmic);
        toast.success('Feature updated successfully!');
      } else {
        // Add new feature
        const updatedFeatures = [...(whyChooseCosmic.features || []), featureFormData];
        const response = await api.patch(`/about/why-choose-cosmic/${whyChooseCosmic._id}`, {
          ...whyChooseCosmic,
          features: updatedFeatures
        });
        setWhyChooseCosmic(response.data.data.whyChooseCosmic);
        toast.success('Feature added successfully!');
      }
      setIsFeatureModalOpen(false);
      setEditingFeature(null);
      resetFeatureForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeature = async (featureIndex) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) return;
    
    setLoading(true);
    try {
      const updatedFeatures = whyChooseCosmic.features.filter((_, index) => index !== featureIndex);
      const response = await api.patch(`/about/why-choose-cosmic/${whyChooseCosmic._id}`, {
        ...whyChooseCosmic,
        features: updatedFeatures
      });
      setWhyChooseCosmic(response.data.data.whyChooseCosmic);
      toast.success('Feature deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      highlightText: '',
      features: [],
      isActive: true
    });
  };

  const resetFeatureForm = () => {
    setFeatureFormData({
      title: '',
      description: '',
      icon: '',
      isActive: true
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      highlightText: item.highlightText,
      features: item.features,
      isActive: item.isActive
    });
    setIsModalOpen(true);
  };

  const handleEditFeature = (feature, index) => {
    setEditingFeature({ ...feature, _id: index });
    setFeatureFormData({
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      isActive: feature.isActive
    });
    setIsFeatureModalOpen(true);
  };

  if (loading && !whyChooseCosmic) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Why Choose Cosmic Section</h1>
          <p className="text-gray-600">Manage the why choose cosmic content and features</p>
        </div>
        <div className="flex gap-2">
          {whyChooseCosmic && (
            <button
              onClick={() => {
                resetFeatureForm();
                setIsFeatureModalOpen(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Feature
            </button>
          )}
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            {whyChooseCosmic ? 'Edit Section' : 'Create Section'}
          </button>
        </div>
      </div>

      {/* Content */}
      {whyChooseCosmic ? (
        <div className="space-y-6">
          {/* Section Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{whyChooseCosmic.title}</h3>
                <p className="text-gray-600">{whyChooseCosmic.highlightText}</p>
                <p className="text-sm text-gray-500">Status: {whyChooseCosmic.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <button
                onClick={() => handleEdit(whyChooseCosmic)}
                className="text-blue-600 hover:text-blue-800"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features ({whyChooseCosmic.features?.length || 0})</h3>
            
            {whyChooseCosmic.features && whyChooseCosmic.features.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {whyChooseCosmic.features.map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditFeature(feature, index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFeature(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {feature.icon && (
                      <div className="mb-2">
                        <span className="text-2xl">{feature.icon}</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                    <p className="text-xs text-gray-500">Status: {feature.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No features added yet</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No why choose cosmic section found</p>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Why Choose Cosmic Section
          </button>
        </div>
      )}

      {/* Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Why Choose Cosmic Section' : 'Create Why Choose Cosmic Section'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Highlight Text *
                </label>
                <input
                  type="text"
                  value={formData.highlightText}
                  onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature Modal */}
      {isFeatureModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingFeature ? 'Edit Feature' : 'Add Feature'}
            </h2>
            
            <form onSubmit={handleFeatureSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={featureFormData.title}
                  onChange={(e) => setFeatureFormData({ ...featureFormData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Emoji or Text)
                </label>
                <input
                  type="text"
                  value={featureFormData.icon}
                  onChange={(e) => setFeatureFormData({ ...featureFormData, icon: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="🌟 or any icon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={featureFormData.description}
                  onChange={(e) => setFeatureFormData({ ...featureFormData, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featureIsActive"
                  checked={featureFormData.isActive}
                  onChange={(e) => setFeatureFormData({ ...featureFormData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="featureIsActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFeatureModalOpen(false);
                    setEditingFeature(null);
                    resetFeatureForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingFeature ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyChooseCosmic;