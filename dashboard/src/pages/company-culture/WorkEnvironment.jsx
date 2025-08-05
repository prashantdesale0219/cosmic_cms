import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import mediaService from '../../services/mediaService';

const WorkEnvironment = () => {
  const [workEnvironmentData, setWorkEnvironmentData] = useState({
    title: '',
    highlightText: '',
    description1: '',
    description2: '',
    description3: '',
    image: '',
    imageAlt: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [workEnvironmentId, setWorkEnvironmentId] = useState(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);

  useEffect(() => {
    fetchWorkEnvironmentData();
  }, []);

  const fetchMediaFiles = async (page = 1) => {
    setIsLoadingMedia(true);
    try {
      const response = await mediaService.getMedia(page, 12);
      if (response.success) {
        setMediaFiles(response.data || []);
        setTotalMediaPages(response.pagination?.totalPages || 1);
        setMediaPage(page);
      }
    } catch (error) {
      console.error('Error fetching media files:', error);
      toast.error('Failed to load media files');
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleMediaSelect = (media) => {
    const mediaUrl = media.url || media.path || media;
    setWorkEnvironmentData(prev => ({
      ...prev,
      image: mediaUrl
    }));
    setShowMediaLibrary(false);
  };

  const openMediaLibrary = () => {
    setShowMediaLibrary(true);
    fetchMediaFiles(1);
  };

  const fetchWorkEnvironmentData = async () => {
    try {
      const response = await api.get('/company-culture/work-environment');
      if (response.data.success && response.data.data) {
        setWorkEnvironmentData(response.data.data);
        setWorkEnvironmentId(response.data.data._id);
      }
    } catch (error) {
      console.error('Error fetching work environment data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setWorkEnvironmentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (workEnvironmentId) {
        response = await api.put(`/company-culture/work-environment/${workEnvironmentId}`, workEnvironmentData);
      } else {
        response = await api.post('/company-culture/work-environment', workEnvironmentData);
      }

      if (response.data.success) {
        toast.success(workEnvironmentId ? 'Work Environment updated successfully!' : 'Work Environment created successfully!');
        if (!workEnvironmentId) {
          setWorkEnvironmentId(response.data.data._id);
        }
      }
    } catch (error) {
      console.error('Error saving work environment:', error);
      toast.error('Failed to save work environment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Work Environment Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={workEnvironmentData.title}
                  onChange={handleInputChange}
                  placeholder="Our Work"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlightText">Highlight Text</Label>
                <Input
                  id="highlightText"
                  name="highlightText"
                  value={workEnvironmentData.highlightText}
                  onChange={handleInputChange}
                  placeholder="Environment"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    name="image"
                    value={workEnvironmentData.image}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/photo-1522202176988-66273c2fd55f..."
                  />
                  <Button
                    type="button"
                    onClick={openMediaLibrary}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Select Media
                  </Button>
                </div>
                {workEnvironmentData.image && (
                  <div className="mt-2">
                    <img 
                      src={workEnvironmentData.image} 
                      alt="Image preview" 
                      className="w-32 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageAlt">Image Alt Text</Label>
                <Input
                  id="imageAlt"
                  name="imageAlt"
                  value={workEnvironmentData.imageAlt}
                  onChange={handleInputChange}
                  placeholder="Collaborative work environment"
                />
              </div>

              <div className="flex items-center space-x-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={workEnvironmentData.isActive}
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
                  value={workEnvironmentData.description1}
                  onChange={handleInputChange}
                  placeholder="We foster a collaborative, inclusive, and innovative workplace..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description2">Description 2</Label>
                <Textarea
                  id="description2"
                  name="description2"
                  value={workEnvironmentData.description2}
                  onChange={handleInputChange}
                  placeholder="We believe in work-life balance and offer flexible scheduling..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description3">Description 3</Label>
                <Textarea
                  id="description3"
                  name="description3"
                  value={workEnvironmentData.description3}
                  onChange={handleInputChange}
                  placeholder="Professional development is a priority, with ongoing training..."
                  rows={3}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : (workEnvironmentId ? 'Update Work Environment' : 'Create Work Environment')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Media</h3>
              <button
                onClick={() => setShowMediaLibrary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {isLoadingMedia ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Loading media files...</div>
              </div>
            ) : (
              <>
                {mediaFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No media files found.</p>
                    <Button
                      onClick={() => fetchMediaFiles(1)}
                      className="mt-2"
                    >
                      Refresh
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                      {mediaFiles.map((media, index) => {
                        const mediaUrl = media.url || media.path || media;
                        const mediaName = media.name || media.filename || `Media ${index + 1}`;
                        
                        return (
                          <div
                            key={index}
                            className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => handleMediaSelect(media)}
                          >
                            <img
                              src={mediaUrl}
                              alt={mediaName}
                              className="w-full h-24 object-cover rounded mb-2"
                            />
                            <p className="text-sm text-gray-600 truncate">{mediaName}</p>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Pagination */}
                    {totalMediaPages > 1 && (
                      <div className="flex justify-center items-center space-x-2">
                        <Button
                          onClick={() => fetchMediaFiles(mediaPage - 1)}
                          disabled={mediaPage === 1}
                          variant="outline"
                          size="sm"
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-gray-600">
                          Page {mediaPage} of {totalMediaPages}
                        </span>
                        <Button
                          onClick={() => fetchMediaFiles(mediaPage + 1)}
                          disabled={mediaPage === totalMediaPages}
                          variant="outline"
                          size="sm"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkEnvironment;