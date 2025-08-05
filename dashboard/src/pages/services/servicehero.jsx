import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import MediaLibraryModal from '../../components/MediaLibraryModal';

const ServiceHero = () => {
  const [serviceHero, setServiceHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    videoUrl: '',
    breadcrumbHome: 'Home',
    breadcrumbCurrent: 'Services',
    isActive: true
  });

  useEffect(() => {
    fetchServiceHero();
  }, []);

  const fetchServiceHero = async () => {
    try {
      const response = await api.get('/services/hero');
      setServiceHero(response.data.data.serviceHero);
      if (response.data.data.serviceHero) {
        setFormData({
          title: response.data.data.serviceHero.title || '',
          subtitle: response.data.data.serviceHero.subtitle || '',
          videoUrl: response.data.data.serviceHero.videoUrl || '',
          breadcrumbHome: response.data.data.serviceHero.breadcrumbHome || 'Home',
          breadcrumbCurrent: response.data.data.serviceHero.breadcrumbCurrent || 'Services',
          isActive: response.data.data.serviceHero.isActive
        });
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch service hero data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (serviceHero) {
        const response = await api.patch(`/services/hero/${serviceHero._id}`, formData);
        setServiceHero(response.data.data.serviceHero);
        toast.success('Service hero updated successfully!');
      } else {
        const response = await api.post('/services/hero', formData);
        setServiceHero(response.data.data.serviceHero);
        toast.success('Service hero created successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelect = (media) => {
    setFormData({ ...formData, videoUrl: media.url });
    setIsMediaModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Hero Section</h1>
        <p className="text-gray-600">Manage the hero section of the services page</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video URL *
          </label>
          <div className="flex">
            <input
              type="text"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setIsMediaModalOpen(true)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-lg hover:bg-gray-300"
            >
              Browse
            </button>
          </div>
          {formData.videoUrl && (
            <div className="mt-2">
              <video
                src={formData.videoUrl}
                className="h-40 rounded-lg object-cover"
                controls
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breadcrumb Home Text
            </label>
            <input
              type="text"
              value={formData.breadcrumbHome}
              onChange={(e) => setFormData({ ...formData, breadcrumbHome: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breadcrumb Current Text
            </label>
            <input
              type="text"
              value={formData.breadcrumbCurrent}
              onChange={(e) => setFormData({ ...formData, breadcrumbCurrent: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : serviceHero ? 'Update' : 'Create'}
          </button>
        </div>
      </form>

      {isMediaModalOpen && (
        <MediaLibraryModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onSelect={handleMediaSelect}
          mediaType="video"
        />
      )}
    </div>
  );
};

export default ServiceHero;