import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { aboutService } from '../../services/api';

const VisionMissionValues = () => {
  const [visionMissionValues, setVisionMissionValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    vision: {
      title: 'Vision',
      description: '',
      additionalDescription: ''
    },
    mission: {
      title: 'Mission',
      description: '',
      additionalDescription: '',
      finalDescription: ''
    },
    values: {
      title: 'Value',
      description: '',
      additionalDescription: ''
    },
    isActive: true
  });

  useEffect(() => {
    fetchVisionMissionValues();
  }, []);

  const fetchVisionMissionValues = async () => {
    try {
      const response = await aboutService.getVisionMissionValues();
      console.log('Vision Mission Values API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // Check if response has status success and data property
        if (response.data.status === 'success' && response.data.data && response.data.data.visionMissionValues) {
          setVisionMissionValues(response.data.data.visionMissionValues);
        }
        // Check if response.data directly contains visionMissionValues
        else if (response.data.visionMissionValues) {
          setVisionMissionValues(response.data.visionMissionValues);
        }
        // Check if response.data is the visionMissionValues object itself
        else if (response.data.vision) {
          setVisionMissionValues(response.data);
        }
        // Fallback: try to get from nested structure
        else if (response.data.data && response.data.data.vision) {
          setVisionMissionValues(response.data.data);
        }
        else {
          console.warn('Unexpected response format:', response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching vision mission values data:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch vision mission values data');
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
        const response = await aboutService.updateVisionMissionValues(formData);
        setVisionMissionValues(response.data.data);
        toast.success('Vision mission values updated successfully!');
      } else {
        const response = await aboutService.createVisionMissionValues(formData);
        setVisionMissionValues(response.data.data);
        toast.success('Vision mission values created successfully!');
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

  const resetForm = () => {
    setFormData({
      vision: {
        title: 'Vision',
        description: '',
        additionalDescription: ''
      },
      mission: {
        title: 'Mission',
        description: '',
        additionalDescription: '',
        finalDescription: ''
      },
      values: {
        title: 'Value',
        description: '',
        additionalDescription: ''
      },
      isActive: true
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      vision: item.vision,
      mission: item.mission,
      values: item.values,
      isActive: item.isActive
    });
    setIsModalOpen(true);
  };

  const updateNestedField = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  if (loading && !visionMissionValues) {
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
          <h1 className="text-2xl font-bold text-gray-900">Vision Mission Values Section</h1>
          <p className="text-gray-600">Manage the vision, mission and values content</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          {visionMissionValues ? 'Edit Section' : 'Create Section'}
        </button>
      </div>

      {/* Content */}
      {visionMissionValues ? (
        <div className="space-y-6">
          {/* Section Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Vision Mission Values</h3>
                <p className="text-sm text-gray-500">Status: {visionMissionValues.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <button
                onClick={() => handleEdit(visionMissionValues)}
                className="text-blue-600 hover:text-blue-800"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{visionMissionValues.vision.title}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900 whitespace-pre-wrap">{visionMissionValues.vision.description}</p>
              </div>
              {visionMissionValues.vision.additionalDescription && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Description</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{visionMissionValues.vision.additionalDescription}</p>
                </div>
              )}
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{visionMissionValues.mission.title}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900 whitespace-pre-wrap">{visionMissionValues.mission.description}</p>
              </div>
              {visionMissionValues.mission.additionalDescription && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Description</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{visionMissionValues.mission.additionalDescription}</p>
                </div>
              )}
              {visionMissionValues.mission.finalDescription && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Final Description</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{visionMissionValues.mission.finalDescription}</p>
                </div>
              )}
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{visionMissionValues.values.title}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900 whitespace-pre-wrap">{visionMissionValues.values.description}</p>
              </div>
              {visionMissionValues.values.additionalDescription && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Description</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{visionMissionValues.values.additionalDescription}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No vision mission values section found</p>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Vision Mission Values Section
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Vision Mission Values Section' : 'Create Vision Mission Values Section'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vision Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Vision</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.vision.title}
                      onChange={(e) => updateNestedField('vision', 'title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.vision.description}
                      onChange={(e) => updateNestedField('vision', 'description', e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Description
                    </label>
                    <textarea
                      value={formData.vision.additionalDescription}
                      onChange={(e) => updateNestedField('vision', 'additionalDescription', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Mission Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mission</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.mission.title}
                      onChange={(e) => updateNestedField('mission', 'title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.mission.description}
                      onChange={(e) => updateNestedField('mission', 'description', e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Description
                    </label>
                    <textarea
                      value={formData.mission.additionalDescription}
                      onChange={(e) => updateNestedField('mission', 'additionalDescription', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Final Description
                    </label>
                    <textarea
                      value={formData.mission.finalDescription}
                      onChange={(e) => updateNestedField('mission', 'finalDescription', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Values Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Values</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.values.title}
                      onChange={(e) => updateNestedField('values', 'title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.values.description}
                      onChange={(e) => updateNestedField('values', 'description', e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Description
                    </label>
                    <textarea
                      value={formData.values.additionalDescription}
                      onChange={(e) => updateNestedField('values', 'additionalDescription', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
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
    </div>
  );
};

export default VisionMissionValues;