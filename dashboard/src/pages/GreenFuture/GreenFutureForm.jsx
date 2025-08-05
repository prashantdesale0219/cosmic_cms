import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getGreenFuture, createOrUpdateGreenFuture } from '../../services/greenFutureService';
import Loader from '../../components/Loader';
import FormField from '../../components/FormField';

const GreenFutureForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGreenFuture();
  }, []);

  const fetchGreenFuture = async () => {
    try {
      setLoading(true);
      const data = await getGreenFuture();
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          ctaText: data.ctaText || '',
          ctaLink: data.ctaLink || '',
          isActive: data.isActive !== undefined ? data.isActive : true
        });
      }
    } catch (err) {
      console.error('Failed to fetch Green Future data:', err);
      toast.error('Failed to load Green Future data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createOrUpdateGreenFuture(formData, token);
      toast.success('Green Future section updated successfully');
      navigate('/green-future');
    } catch (err) {
      console.error('Failed to update Green Future section:', err);
      toast.error('Failed to update Green Future section');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Green Future Section</h1>
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
              placeholder="Enter section title"
              required
            />

            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter section description"
              required
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="CTA Text"
                name="ctaText"
                type="text"
                value={formData.ctaText}
                onChange={handleChange}
                placeholder="Enter call-to-action text"
              />

              <FormField
                label="CTA Link"
                name="ctaLink"
                type="text"
                value={formData.ctaLink}
                onChange={handleChange}
                placeholder="Enter call-to-action link"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
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
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GreenFutureForm;