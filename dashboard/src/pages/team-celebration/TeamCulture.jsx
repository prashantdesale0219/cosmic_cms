import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import MediaLibraryModal from '../../components/MediaLibraryModal';

const TeamCulture = () => {
  const [loading, setLoading] = useState(true);
  const [teamCulture, setTeamCulture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    secondDescription: '',
    image: '',
    stats: {
      annualEvents: { count: 0, label: 'Annual Events' },
      employeeSatisfaction: { count: 0, label: 'Employee Satisfaction' },
      industryAwards: { count: 0, label: 'Industry Awards' }
    },
    isActive: true
  });

  useEffect(() => {
    fetchTeamCulture();
  }, []);

  const fetchTeamCulture = async () => {
    try {
      const response = await api.get('/team-celebration/culture');
      setTeamCulture(response.data.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch team culture data');
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
        const response = await api.put(`/team-celebration/culture/${editingItem._id}`, formData);
        setTeamCulture(response.data.data);
        toast.success('Team culture updated successfully!');
      } else {
        const response = await api.post('/team-celebration/culture', formData);
        setTeamCulture(response.data.data);
        toast.success('Team culture created successfully!');
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
      title: '',
      description: '',
      secondDescription: '',
      image: '',
      stats: {
        annualEvents: { count: 0, label: 'Annual Events' },
        employeeSatisfaction: { count: 0, label: 'Employee Satisfaction' },
        industryAwards: { count: 0, label: 'Industry Awards' }
      },
      isActive: true
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      secondDescription: item.secondDescription,
      image: item.image,
      stats: item.stats || {
        annualEvents: { count: 0, label: 'Annual Events' },
        employeeSatisfaction: { count: 0, label: 'Employee Satisfaction' },
        industryAwards: { count: 0, label: 'Industry Awards' }
      },
      isActive: item.isActive
    });
    setIsModalOpen(true);
  };

  const handleMediaSelect = (media) => {
    setFormData({ ...formData, image: media.url });
    setIsMediaModalOpen(false);
  };

  const updateStat = (statKey, field, value) => {
    setFormData({
      ...formData,
      stats: {
        ...formData.stats,
        [statKey]: {
          ...formData.stats[statKey],
          [field]: field === 'count' ? parseInt(value) || 0 : value
        }
      }
    });
  };

  if (loading && !teamCulture) {
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
          <h1 className="text-2xl font-bold text-gray-900">Team Culture Section</h1>
          <p className="text-gray-600">Manage the team culture section content</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          {teamCulture ? 'Edit Culture' : 'Create Culture'}
        </button>
      </div>

      {/* Content */}
      {teamCulture ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{teamCulture.title}</h3>
              <p className="text-sm text-gray-500">Status: {teamCulture.isActive ? 'Active' : 'Inactive'}</p>
            </div>
            <button
              onClick={() => handleEdit(teamCulture)}
              className="text-blue-600 hover:text-blue-800"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{teamCulture.description}</p>
            </div>
            
            {teamCulture.secondDescription && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Second Description</label>
                <p className="text-gray-900">{teamCulture.secondDescription}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              {teamCulture.image && (
                <img 
                  src={teamCulture.image} 
                  alt="Team Culture" 
                  className="w-32 h-20 object-cover rounded-lg"
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statistics</label>
              <div className="grid grid-cols-3 gap-4">
                {teamCulture.stats && Object.entries(teamCulture.stats).map(([key, stat]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stat.count}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No team culture section found</p>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Team Culture Section
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Team Culture Section' : 'Create Team Culture Section'}
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
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Second Description
                </label>
                <textarea
                  value={formData.secondDescription}
                  onChange={(e) => setFormData({ ...formData, secondDescription: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Image URL"
                  />
                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <PhotoIcon className="h-5 w-5" />
                    Select Media
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statistics
                </label>
                <div className="space-y-3">
                  {Object.entries(formData.stats).map(([key, stat]) => (
                    <div key={key} className="grid grid-cols-3 gap-2 items-center">
                      <div className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <input
                        type="number"
                        value={stat.count}
                        onChange={(e) => updateStat(key, 'count', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Count"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStat(key, 'label', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Label"
                      />
                    </div>
                  ))}
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

      {/* Media Library Modal */}
      {isMediaModalOpen && (
        <MediaLibraryModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onSelect={handleMediaSelect}
          acceptedTypes={['image']}
        />
      )}
    </div>
  );
};

export default TeamCulture;