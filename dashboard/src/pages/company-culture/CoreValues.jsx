import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import api from '../../services/api';

const CoreValues = () => {
  const [coreValues, setCoreValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingValue, setEditingValue] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'FaLeaf',
    order: 0,
    isActive: true
  });

  const iconOptions = [
    { value: 'FaLeaf', label: 'Leaf (Sustainability)' },
    { value: 'FaSolarPanel', label: 'Solar Panel (Innovation)' },
    { value: 'FaHandshake', label: 'Handshake (Integrity)' },
    { value: 'FaLightbulb', label: 'Lightbulb (Excellence)' },
    { value: 'FaUsers', label: 'Users (Teamwork)' },
    { value: 'FaHeart', label: 'Heart (Care)' },
    { value: 'FaShield', label: 'Shield (Trust)' },
    { value: 'FaRocket', label: 'Rocket (Growth)' }
  ];

  useEffect(() => {
    fetchCoreValues();
  }, []);

  const fetchCoreValues = async () => {
    try {
      const response = await api.get('/company-culture/core-values');
      if (response.data.success) {
        setCoreValues(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching core values:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (editingValue) {
        response = await api.put(`/company-culture/core-values/${editingValue._id}`, formData);
      } else {
        response = await api.post('/company-culture/core-values', formData);
      }

      if (response.data.success) {
        toast.success(editingValue ? 'Core value updated successfully!' : 'Core value created successfully!');
        fetchCoreValues();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving core value:', error);
      toast.error('Failed to save core value');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (value) => {
    setEditingValue(value);
    setFormData({
      title: value.title,
      description: value.description,
      icon: value.icon,
      order: value.order,
      isActive: value.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this core value?')) {
      try {
        await api.delete(`/company-culture/core-values/${id}`);
        toast.success('Core value deleted successfully!');
        fetchCoreValues();
      } catch (error) {
        console.error('Error deleting core value:', error);
        toast.error('Failed to delete core value');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'FaLeaf',
      order: 0,
      isActive: true
    });
    setEditingValue(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Core Values Management</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Core Value
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingValue ? 'Edit Core Value' : 'Add New Core Value'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Sustainability"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <select
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="We are committed to environmental stewardship..."
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingValue ? 'Update' : 'Create')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {coreValues.map((value) => (
          <Card key={value._id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-semibold">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {value.icon}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Order: {value.order}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        value.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {value.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(value)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(value._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {coreValues.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No core values found. Add your first core value to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoreValues;