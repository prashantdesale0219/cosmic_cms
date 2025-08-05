import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const SavingsCalculator = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    monthlyBillLabel: '',
    sunlightHoursLabel: '',
    roofSizeLabel: '',
    calculateButtonText: '',
    isActive: true
  });

  useEffect(() => {
    fetchCalculatorData();
  }, []);

  const fetchCalculatorData = async () => {
    try {
      const response = await api.get('/services/savings-calculator');
      if (response.data.data.savingsCalculator) {
        setFormData(response.data.data.savingsCalculator);
      }
    } catch (error) {
      toast.error('Failed to fetch calculator data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await api.post('/services/savings-calculator', formData);
      setFormData(response.data.data.savingsCalculator);
      toast.success('Savings calculator updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Savings Calculator</h1>
        <p className="text-gray-600">Manage the savings calculator section displayed on the services page</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Bill Label *
              </label>
              <input
                type="text"
                value={formData.monthlyBillLabel}
                onChange={(e) => setFormData({ ...formData, monthlyBillLabel: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., Monthly Electricity Bill"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sunlight Hours Label *
              </label>
              <input
                type="text"
                value={formData.sunlightHoursLabel}
                onChange={(e) => setFormData({ ...formData, sunlightHoursLabel: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., Daily Sunlight Hours"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roof Size Label *
              </label>
              <input
                type="text"
                value={formData.roofSizeLabel}
                onChange={(e) => setFormData({ ...formData, roofSizeLabel: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., Roof Size (sq ft)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calculate Button Text *
              </label>
              <input
                type="text"
                value={formData.calculateButtonText}
                onChange={(e) => setFormData({ ...formData, calculateButtonText: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., Calculate Savings"
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

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={fetchCalculatorData}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Preview</h2>
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{formData.title || 'Calculator Title'}</h3>
          <p className="text-gray-700 mb-4">{formData.description || 'Calculator description will appear here.'}</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.monthlyBillLabel || 'Monthly Bill'}
              </label>
              <input
                type="text"
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                placeholder="$100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.sunlightHoursLabel || 'Sunlight Hours'}
              </label>
              <input
                type="text"
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                placeholder="5 hours"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.roofSizeLabel || 'Roof Size'}
              </label>
              <input
                type="text"
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                placeholder="1000 sq ft"
              />
            </div>
            
            <button
              type="button"
              disabled
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg opacity-80"
            >
              {formData.calculateButtonText || 'Calculate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;