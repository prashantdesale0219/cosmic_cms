import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const JoinTeamCTA = () => {
  const [ctaData, setCtaData] = useState({
    title: '',
    highlightText: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    backgroundColor: '#003e63',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [ctaId, setCtaId] = useState(null);

  useEffect(() => {
    fetchCtaData();
  }, []);

  const fetchCtaData = async () => {
    try {
      const response = await api.get('/company-culture/join-team-cta');
      if (response.data.success && response.data.data) {
        setCtaData(response.data.data);
        setCtaId(response.data.data._id);
      }
    } catch (error) {
      console.error('Error fetching CTA data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCtaData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (ctaId) {
        response = await api.put(`/company-culture/join-team-cta/${ctaId}`, ctaData);
      } else {
        response = await api.post('/company-culture/join-team-cta', ctaData);
      }

      if (response.data.success) {
        toast.success(ctaId ? 'Join Team CTA updated successfully!' : 'Join Team CTA created successfully!');
        if (!ctaId) {
          setCtaId(response.data.data._id);
        }
      }
    } catch (error) {
      console.error('Error saving CTA:', error);
      toast.error('Failed to save CTA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Join Our Team CTA Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={ctaData.title}
                  onChange={handleInputChange}
                  placeholder="Ready to Join Our"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlightText">Highlight Text</Label>
                <Input
                  id="highlightText"
                  name="highlightText"
                  value={ctaData.highlightText}
                  onChange={handleInputChange}
                  placeholder="Mission?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaText">CTA Button Text</Label>
                <Input
                  id="ctaText"
                  name="ctaText"
                  value={ctaData.ctaText}
                  onChange={handleInputChange}
                  placeholder="Explore Careers"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaLink">CTA Link</Label>
                <Input
                  id="ctaLink"
                  name="ctaLink"
                  value={ctaData.ctaLink}
                  onChange={handleInputChange}
                  placeholder="/careers"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  name="backgroundColor"
                  type="color"
                  value={ctaData.backgroundColor}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={ctaData.isActive}
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
                value={ctaData.description}
                onChange={handleInputChange}
                placeholder="Be part of a team that's shaping the future of sustainable energy. Discover opportunities to grow, innovate, and make a meaningful impact."
                rows={4}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : (ctaId ? 'Update Join Team CTA' : 'Create Join Team CTA')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinTeamCTA;