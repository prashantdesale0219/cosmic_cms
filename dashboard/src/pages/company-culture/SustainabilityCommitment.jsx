import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import api from '../../services/api';

const SustainabilityCommitment = () => {
  const [commitmentData, setCommitmentData] = useState({
    title: '',
    highlightText: '',
    subtitle: '',
    commitments: [],
    backgroundColor: '#003e63',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [commitmentId, setCommitmentId] = useState(null);

  useEffect(() => {
    fetchCommitmentData();
  }, []);

  const fetchCommitmentData = async () => {
    try {
      const response = await api.get('/company-culture/sustainability-commitment');
      if (response.data.success && response.data.data) {
        setCommitmentData(response.data.data);
        setCommitmentId(response.data.data._id);
      }
    } catch (error) {
      console.error('Error fetching commitment data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCommitmentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCommitmentChange = (index, field, value) => {
    const updatedCommitments = [...commitmentData.commitments];
    updatedCommitments[index] = {
      ...updatedCommitments[index],
      [field]: value
    };
    setCommitmentData(prev => ({
      ...prev,
      commitments: updatedCommitments
    }));
  };

  const addCommitment = () => {
    setCommitmentData(prev => ({
      ...prev,
      commitments: [
        ...prev.commitments,
        {
          title: '',
          description: '',
          order: prev.commitments.length
        }
      ]
    }));
  };

  const removeCommitment = (index) => {
    setCommitmentData(prev => ({
      ...prev,
      commitments: prev.commitments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (commitmentId) {
        response = await api.put(`/company-culture/sustainability-commitment/${commitmentId}`, commitmentData);
      } else {
        response = await api.post('/company-culture/sustainability-commitment', commitmentData);
      }

      if (response.data.success) {
        toast.success(commitmentId ? 'Sustainability Commitment updated successfully!' : 'Sustainability Commitment created successfully!');
        if (!commitmentId) {
          setCommitmentId(response.data.data._id);
        }
      }
    } catch (error) {
      console.error('Error saving commitment:', error);
      toast.error('Failed to save commitment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Sustainability Commitment Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={commitmentData.title}
                  onChange={handleInputChange}
                  placeholder="Our Commitment to"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlightText">Highlight Text</Label>
                <Input
                  id="highlightText"
                  name="highlightText"
                  value={commitmentData.highlightText}
                  onChange={handleInputChange}
                  placeholder="Sustainability"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  name="backgroundColor"
                  type="color"
                  value={commitmentData.backgroundColor}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={commitmentData.isActive}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                name="subtitle"
                value={commitmentData.subtitle}
                onChange={handleInputChange}
                placeholder="Beyond our products, we're committed to sustainable operations in every aspect of our business."
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Commitments</Label>
                <Button type="button" onClick={addCommitment} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Commitment
                </Button>
              </div>

              {commitmentData.commitments.map((commitment, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-4">
                    <GripVertical className="h-5 w-5 text-gray-400 mt-2" />
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`commitment-title-${index}`}>Title</Label>
                          <Input
                            id={`commitment-title-${index}`}
                            value={commitment.title}
                            onChange={(e) => handleCommitmentChange(index, 'title', e.target.value)}
                            placeholder="Carbon-Neutral Operations"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`commitment-order-${index}`}>Order</Label>
                          <Input
                            id={`commitment-order-${index}`}
                            type="number"
                            value={commitment.order}
                            onChange={(e) => handleCommitmentChange(index, 'order', parseInt(e.target.value))}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`commitment-description-${index}`}>Description</Label>
                        <Textarea
                          id={`commitment-description-${index}`}
                          value={commitment.description}
                          onChange={(e) => handleCommitmentChange(index, 'description', e.target.value)}
                          placeholder="Our facilities are powered by 100% renewable energy..."
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCommitment(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}

              {commitmentData.commitments.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">No commitments added yet. Click "Add Commitment" to get started.</p>
                </Card>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : (commitmentId ? 'Update Sustainability Commitment' : 'Create Sustainability Commitment')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainabilityCommitment;