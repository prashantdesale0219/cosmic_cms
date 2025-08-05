import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const BrandVision = () => {
  const [brandVisionData, setBrandVisionData] = useState({
    title: '',
    highlightText: '',
    description1: '',
    description2: '',
    description3: '',
    ctaText: '',
    ctaLink: '',
    videoUrl: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [brandVisionId, setBrandVisionId] = useState(null);

  useEffect(() => {
    fetchBrandVisionData();
  }, []);

  const fetchBrandVisionData = async () => {
    try {
      const response = await api.get('/company-culture/brand-vision');
      if (response.data.success && response.data.data) {
        setBrandVisionData(response.data.data);
        setBrandVisionId(response.data.data._id);
      }
    } catch (error) {
      console.error('Error fetching brand vision data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBrandVisionData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (brandVisionId) {
        response = await api.put(`/company-culture/brand-vision/${brandVisionId}`, brandVisionData);
      } else {
        response = await api.post('/company-culture/brand-vision', brandVisionData);
      }

      if (response.data.success) {
        toast.success(brandVisionId ? 'Brand Vision updated successfully!' : 'Brand Vision created successfully!');
        if (!brandVisionId) {
          setBrandVisionId(response.data.data._id);
        }
      }
    } catch (error) {
      console.error('Error saving brand vision:', error);
      toast.error('Failed to save brand vision');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand Vision & Strategy Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={brandVisionData.title}
                  onChange={handleInputChange}
                  placeholder="Brand Vision & Stratergy"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlightText">Highlight Text</Label>
                <Input
                  id="highlightText"
                  name="highlightText"
                  value={brandVisionData.highlightText}
                  onChange={handleInputChange}
                  placeholder="Brand Vision & Stratergy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaText">CTA Button Text</Label>
                <Input
                  id="ctaText"
                  name="ctaText"
                  value={brandVisionData.ctaText}
                  onChange={handleInputChange}
                  placeholder="Join Our Mission"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaLink">CTA Button Link</Label>
                <Input
                  id="ctaLink"
                  name="ctaLink"
                  value={brandVisionData.ctaLink}
                  onChange={handleInputChange}
                  placeholder="/contact"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  value={brandVisionData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="/company-culture.mp4"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={brandVisionData.isActive}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description1">Description 1</Label>
                <Textarea
                  id="description1"
                  name="description1"
                  value={brandVisionData.description1}
                  onChange={handleInputChange}
                  placeholder="To make our future more vibrant and sustainable..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description2">Description 2</Label>
                <Textarea
                  id="description2"
                  name="description2"
                  value={brandVisionData.description2}
                  onChange={handleInputChange}
                  placeholder="We are also committed to maintain our leadership position..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description3">Description 3</Label>
                <Textarea
                  id="description3"
                  name="description3"
                  value={brandVisionData.description3}
                  onChange={handleInputChange}
                  placeholder="To achieve 8 GW production capacity by 2025..."
                  rows={3}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : (brandVisionId ? 'Update Brand Vision' : 'Create Brand Vision')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandVision;