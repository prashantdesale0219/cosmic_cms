import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { aboutService } from '../../services/api';
import MediaLibraryModal from '../../components/MediaLibraryModal';

const AboutHero = () => {
  const [loading, setLoading] = useState(true);
  const [aboutHero, setAboutHero] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    breadcrumbs: [{ name: 'Home', href: '/' }, { name: 'About', href: '/about' }],
    isActive: true
  });

  useEffect(() => {
    fetchAboutHero();
  }, []);

  const fetchAboutHero = async () => {
    try {
      const response = await aboutService.getAboutHero();
      console.log('About Hero API response:', response);
      
      // Handle different response formats
      if (response && response.data) {
        // Check if response has status success and data property
        if (response.data.status === 'success' && response.data.data && response.data.data.aboutHero) {
          setAboutHero(response.data.data.aboutHero);
        }
        // Check if response.data directly contains aboutHero
        else if (response.data.aboutHero) {
          setAboutHero(response.data.aboutHero);
        }
        // Check if response.data is the aboutHero object itself
        else if (response.data.title) {
          setAboutHero(response.data);
        }
        // Fallback: try to get from nested structure
        else if (response.data.data && response.data.data.title) {
          setAboutHero(response.data.data);
        }
        else {
          console.warn('Unexpected response format:', response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching about hero data:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch about hero data');
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
        const response = await aboutService.updateAboutHero(formData);
        setAboutHero(response.data.data);
        toast.success('About hero updated successfully!');
      } else {
        const response = await aboutService.createAboutHero(formData);
        setAboutHero(response.data.data);
        toast.success('About hero created successfully!');
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
      videoUrl: '',
      breadcrumbs: [{ name: 'Home', href: '/' }, { name: 'About', href: '/about' }],
      isActive: true
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      videoUrl: item.videoUrl,
      breadcrumbs: item.breadcrumbs,
      isActive: item.isActive
    });
    setIsModalOpen(true);
  };

  const addBreadcrumb = () => {
    setFormData({
      ...formData,
      breadcrumbs: [...formData.breadcrumbs, { name: '', href: '' }]
    });
  };

  const updateBreadcrumb = (index, field, value) => {
    const updatedBreadcrumbs = formData.breadcrumbs.map((breadcrumb, i) => 
      i === index ? { ...breadcrumb, [field]: value } : breadcrumb
    );
    setFormData({ ...formData, breadcrumbs: updatedBreadcrumbs });
  };

  const removeBreadcrumb = (index) => {
    const updatedBreadcrumbs = formData.breadcrumbs.filter((_, i) => i !== index);
    setFormData({ ...formData, breadcrumbs: updatedBreadcrumbs });
  };

  const handleMediaSelect = (media) => {
    setFormData({ ...formData, videoUrl: media.url });
    setIsMediaModalOpen(false);
  };

  if (loading && !aboutHero) {
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
          <h1 className="text-2xl font-bold text-gray-900">About Hero Section</h1>
          <p className="text-gray-600">Manage the hero section of the about page</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          {aboutHero ? 'Edit Hero' : 'Create Hero'}
        </button>
      </div>

      {/* Content */}
      {aboutHero ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{aboutHero.title}</h3>
              <p className="text-sm text-gray-500">Status: {aboutHero.isActive ? 'Active' : 'Inactive'}</p>
            </div>
            <button
              onClick={() => handleEdit(aboutHero)}
              className="text-blue-600 hover:text-blue-800"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <p className="text-gray-900">{aboutHero.videoUrl}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Breadcrumbs</label>
              <div className="flex flex-wrap gap-2">
                {aboutHero.breadcrumbs && aboutHero.breadcrumbs.length > 0 ? (
                  aboutHero.breadcrumbs.map((breadcrumb, index) => (
                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {breadcrumb.name}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No breadcrumbs available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No hero section found</p>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Hero Section
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Hero Section' : 'Create Hero Section'}
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
                  Video URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Breadcrumbs
                </label>
                <div className="space-y-2">
                  {formData.breadcrumbs.map((breadcrumb, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={breadcrumb.name}
                        onChange={(e) => updateBreadcrumb(index, 'name', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="URL"
                        value={breadcrumb.href}
                        onChange={(e) => updateBreadcrumb(index, 'href', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.breadcrumbs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBreadcrumb(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBreadcrumb}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add Breadcrumb
                  </button>
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
          acceptedTypes={['video']}
        />
      )}
    </div>
  );
};

export default AboutHero;