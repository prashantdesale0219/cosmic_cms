import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { aboutService } from '../../services/api';
import MediaLibraryModal from '../../components/MediaLibraryModal';

const OurExpertise = () => {
  const [ourExpertise, setOurExpertise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    industries: [],
    isActive: true
  });
  const [industryFormData, setIndustryFormData] = useState({
    name: '',
    image: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchOurExpertise();
  }, []);

  const fetchOurExpertise = async () => {
    try {
      const response = await aboutService.getOurExpertise();
      console.log('Our Expertise API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // Check if response has status success and data property
        if (response.data.status === 'success' && response.data.data && response.data.data.ourExpertise) {
          setOurExpertise(response.data.data.ourExpertise);
        }
        // Check if response.data directly contains ourExpertise
        else if (response.data.ourExpertise) {
          setOurExpertise(response.data.ourExpertise);
        }
        // Check if response.data is the ourExpertise object itself
        else if (response.data.title) {
          setOurExpertise(response.data);
        }
        // Fallback: try to get from nested structure
        else if (response.data.data && response.data.data.title) {
          setOurExpertise(response.data.data);
        }
        else {
          console.warn('Unexpected response format:', response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching our expertise data:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch our expertise data');
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
        const response = await aboutService.updateOurExpertise(formData);
        setOurExpertise(response.data.data);
        toast.success('Our expertise updated successfully!');
      } else {
        const response = await aboutService.createOurExpertise(formData);
        setOurExpertise(response.data.data);
        toast.success('Our expertise created successfully!');
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

  const handleIndustrySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingIndustry) {
        const response = await api.patch(`/about/our-expertise/${ourExpertise._id}/industries/${editingIndustry._id}`, industryFormData);
        setOurExpertise(response.data.data.ourExpertise);
        toast.success('Industry updated successfully!');
      } else {
        const response = await api.post(`/about/our-expertise/${ourExpertise._id}/industries`, industryFormData);
        setOurExpertise(response.data.data.ourExpertise);
        toast.success('Industry added successfully!');
      }
      setIsIndustryModalOpen(false);
      setEditingIndustry(null);
      resetIndustryForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIndustry = async (industryId) => {
    if (!window.confirm('Are you sure you want to delete this industry?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/about/our-expertise/${ourExpertise._id}/industries/${industryId}`);
      await fetchOurExpertise();
      toast.success('Industry deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      industries: [],
      isActive: true
    });
  };

  const resetIndustryForm = () => {
    setIndustryFormData({
      name: '',
      image: '',
      description: '',
      isActive: true
    });
  };

  const handleMediaSelect = (media) => {
    setIndustryFormData({ ...industryFormData, image: media.url });
    setShowMediaLibrary(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      subtitle: item.subtitle,
      industries: item.industries,
      isActive: item.isActive
    });
    setIsModalOpen(true);
  };

  const handleEditIndustry = (industry) => {
    setEditingIndustry(industry);
    setIndustryFormData({
      name: industry.name,
      image: industry.image,
      description: industry.description,
      isActive: industry.isActive
    });
    setIsIndustryModalOpen(true);
  };

  if (loading && !ourExpertise) {
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
          <h1 className="text-2xl font-bold text-gray-900">Our Expertise Section</h1>
          <p className="text-gray-600">Manage the our expertise content and industries</p>
        </div>
        <div className="flex gap-2">
          {ourExpertise && (
            <button
              onClick={() => {
                resetIndustryForm();
                setIsIndustryModalOpen(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Industry
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
            {ourExpertise ? 'Edit Section' : 'Create Section'}
          </button>
        </div>
      </div>

      {/* Content */}
      {ourExpertise ? (
        <div className="space-y-6">
          {/* Section Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{ourExpertise.title}</h3>
                <p className="text-gray-600">{ourExpertise.subtitle}</p>
                <p className="text-sm text-gray-500">Status: {ourExpertise.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <button
                onClick={() => handleEdit(ourExpertise)}
                className="text-blue-600 hover:text-blue-800"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Industries */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Industries ({ourExpertise.industries?.length || 0})</h3>
            
            {ourExpertise.industries && ourExpertise.industries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ourExpertise.industries.map((industry) => (
                  <div key={industry._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{industry.name}</h4>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditIndustry(industry)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIndustry(industry._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {industry.image && (
                      <img 
                        src={industry.image} 
                        alt={industry.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <p className="text-sm text-gray-600 mb-2">{industry.description}</p>
                    <p className="text-xs text-gray-500">Status: {industry.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No industries added yet</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No our expertise section found</p>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Our Expertise Section
          </button>
        </div>
      )}

      {/* Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Our Expertise Section' : 'Create Our Expertise Section'}
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
                  Subtitle *
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
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

      {/* Industry Modal */}
      {isIndustryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingIndustry ? 'Edit Industry' : 'Add Industry'}
            </h2>
            
            <form onSubmit={handleIndustrySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={industryFormData.name}
                  onChange={(e) => setIndustryFormData({ ...industryFormData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={industryFormData.image}
                    onChange={(e) => setIndustryFormData({ ...industryFormData, image: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Image URL or select from media library"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setShowMediaLibrary(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <PhotoIcon className="h-4 w-4" />
                    Select
                  </button>
                </div>
                {industryFormData.image && (
                  <div className="mt-2">
                    <img
                      src={industryFormData.image}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={industryFormData.description}
                  onChange={(e) => setIndustryFormData({ ...industryFormData, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="industryIsActive"
                  checked={industryFormData.isActive}
                  onChange={(e) => setIndustryFormData({ ...industryFormData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="industryIsActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsIndustryModalOpen(false);
                    setEditingIndustry(null);
                    resetIndustryForm();
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
                  {loading ? 'Saving...' : editingIndustry ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={handleMediaSelect}
        mediaType="image"
      />
    </div>
  );
};

export default OurExpertise;