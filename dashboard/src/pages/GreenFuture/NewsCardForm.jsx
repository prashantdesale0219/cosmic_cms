import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getGreenFuture, addNewsCard, updateNewsCard } from '../../services/greenFutureService';
import Loader from '../../components/Loader';
import FormField from '../../components/FormField';
import MediaLibraryModal from '../../components/MediaLibraryModal';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const NewsCardForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    logo: '',
    date: '',
    excerpt: '',
    content: '',
    order: 0
  });
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentMediaField, setCurrentMediaField] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      fetchNewsCard();
    }
  }, [isEditMode, id]);

  const fetchNewsCard = async () => {
    try {
      setLoading(true);
      const data = await getGreenFuture();
      console.log('Green Future Data:', data);
      
      // Ensure newsCards is always an array
      if (!data.newsCards) {
        data.newsCards = [];
      }
      
      console.log('News Cards:', data.newsCards);
      console.log('News Cards length:', data.newsCards.length);
      console.log('Looking for ID:', id);
      console.log('ID type:', typeof id);
      
      if (data && data.newsCards && data.newsCards.length > 0) {
        console.log('News Cards IDs:', data.newsCards.map(card => card._id));
        console.log('News Cards ID types:', data.newsCards.map(card => typeof card._id));
        
        // Try both direct comparison and string comparison
        const newsCard = data.newsCards.find(card => {
          if (!card || !card._id) return false;
          return card._id === id || card._id.toString() === id.toString();
        });
        console.log('Found news card:', newsCard);
        
        if (newsCard) {
          console.log('Setting form data with news card:', newsCard);
          setFormData({
            title: newsCard.title || '',
            image: newsCard.image || '',
            logo: newsCard.logo || '',
            date: newsCard.date || '',
            excerpt: newsCard.excerpt || '',
            content: newsCard.content || '',
            order: newsCard.order || 0
          });
        } else {
          console.error('News card with ID', id, 'not found in', data.newsCards);
          console.error('ID comparison results:', data.newsCards.map(card => ({
            cardId: card._id,
            paramId: id,
            directMatch: card._id === id,
            stringMatch: card._id.toString() === id.toString()
          })));
          toast.error('News card not found');
          navigate('/green-future');
        }
      } else {
        console.error('No news cards found in data:', data);
        toast.error('No news cards found');
        navigate('/green-future');
      }
    } catch (err) {
      console.error('Failed to fetch news card:', err);
      toast.error('Failed to load news card data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value, 10) : value
    });
  };

  const handleOpenMediaLibrary = (fieldName) => {
    setCurrentMediaField(fieldName);
    setShowMediaLibrary(true);
  };

  const handleMediaSelect = (mediaUrl) => {
    if (currentMediaField) {
      setFormData({
        ...formData,
        [currentMediaField]: mediaUrl
      });
    }
    setShowMediaLibrary(false);
    setCurrentMediaField('');
  };

  const handleRemoveImage = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    console.log('NewsCardForm - Submitting form with data:', formData);
    console.log('NewsCardForm - Is edit mode:', isEditMode);
    console.log('NewsCardForm - Token:', token ? 'Present' : 'Missing');
    if (isEditMode) {
      console.log('NewsCardForm - Updating news card with ID:', id);
    }

    try {
      if (isEditMode) {
        console.log('NewsCardForm - Calling updateNewsCard with ID:', id);
        const result = await updateNewsCard(id, formData, token);
        console.log('NewsCardForm - Update result:', result);
        if (result.success || result.data) {
          toast.success(result.message || 'News card updated successfully');
          navigate('/green-future');
        } else {
          throw new Error(result.message || 'Failed to update news card');
        }
      } else {
        console.log('NewsCardForm - Calling addNewsCard');
        const result = await addNewsCard(formData, token);
        console.log('NewsCardForm - Add result:', result);
        if (result.success || result.data) {
          toast.success(result.message || 'News card created successfully');
          navigate('/green-future');
        } else {
          throw new Error(result.message || 'Failed to create news card');
        }
      }
    } catch (err) {
      console.error('NewsCardForm - Failed to save news card:', err);
      console.error('NewsCardForm - Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'create'} news card`;
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit News Card' : 'Create News Card'}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <FormField
              label="Title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter news title"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  News Image
                </label>
                <div className="mt-1 flex items-center">
                  {formData.image ? (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="News"
                        className="h-32 w-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('image')}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleOpenMediaLibrary('image')}
                      className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
                    >
                      <PhotoIcon className="h-8 w-8" aria-hidden="true" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenMediaLibrary('image')}
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {formData.image ? 'Change' : 'Select'} Image
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo Image
                </label>
                <div className="mt-1 flex items-center">
                  {formData.logo ? (
                    <div className="relative">
                      <img
                        src={formData.logo}
                        alt="Logo"
                        className="h-32 w-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('logo')}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleOpenMediaLibrary('logo')}
                      className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
                    >
                      <PhotoIcon className="h-8 w-8" aria-hidden="true" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenMediaLibrary('logo')}
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {formData.logo ? 'Change' : 'Select'} Logo
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Leave empty to use default logo
                </p>
              </div>
            </div>

            <FormField
              label="Date"
              name="date"
              type="text"
              value={formData.date}
              onChange={handleChange}
              placeholder="E.g., June 15, 2023"
              required
            />

            <FormField
              label="Excerpt"
              name="excerpt"
              type="textarea"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Enter a brief excerpt"
              required
              rows={2}
            />

            <FormField
              label="Content"
              name="content"
              type="textarea"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter the full content"
              required
              rows={6}
            />

            <FormField
              label="Display Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              min={0}
              step={1}
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/green-future')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update News Card' : 'Create News Card'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => {
          setShowMediaLibrary(false);
          setCurrentMediaField('');
        }}
        onSelect={handleMediaSelect}
        title={`Select ${currentMediaField === 'image' ? 'News Image' : 'Logo Image'}`}
      />
    </div>
  );
};

export default NewsCardForm;