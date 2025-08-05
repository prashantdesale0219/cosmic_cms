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

const CompanyCultureHero = () => {
  const [heroData, setHeroData] = useState({
    title: '',
    backgroundImage: '',
    breadcrumbHome: '',
    breadcrumbAbout: '',
    breadcrumbCurrent: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [heroId, setHeroId] = useState(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);

  useEffect(() => {
    fetchHeroData();
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
    setHeroData(prev => ({
      ...prev,
      backgroundImage: mediaUrl
    }));
    setShowMediaLibrary(false);
  };

  const openMediaLibrary = () => {
    setShowMediaLibrary(true);
    fetchMediaFiles(1);
  };

  const fetchHeroData = async () => {
    try {
      const response = await api.get('/company-culture/hero');
      if (response.data.success && response.data.data) {
        setHeroData(response.data.data);
        setHeroId(response.data.data._id);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHeroData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (heroId) {
        response = await api.put(`/company-culture/hero/${heroId}`, heroData);
      } else {
        response = await api.post('/company-culture/hero', heroData);
      }

      if (response.data.success) {
        toast.success(heroId ? 'Hero updated successfully!' : 'Hero created successfully!');
        if (!heroId) {
          setHeroId(response.data.data._id);
        }
      }
    } catch (error) {
      console.error('Error saving hero:', error);
      toast.error('Failed to save hero');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Culture Hero Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={heroData.title}
                  onChange={handleInputChange}
                  placeholder="Company Culture"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backgroundImage">Background Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="backgroundImage"
                    name="backgroundImage"
                    value={heroData.backgroundImage}
                    onChange={handleInputChange}
                    placeholder="/companyculture.jpeg"
                    required
                  />
                  <Button
                    type="button"
                    onClick={openMediaLibrary}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Select Media
                  </Button>
                </div>
                {heroData.backgroundImage && (
                  <div className="mt-2">
                    <img 
                      src={heroData.backgroundImage} 
                      alt="Background preview" 
                      className="w-32 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="breadcrumbHome">Breadcrumb Home Text</Label>
                <Input
                  id="breadcrumbHome"
                  name="breadcrumbHome"
                  value={heroData.breadcrumbHome}
                  onChange={handleInputChange}
                  placeholder="Home"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="breadcrumbAbout">Breadcrumb About Text</Label>
                <Input
                  id="breadcrumbAbout"
                  name="breadcrumbAbout"
                  value={heroData.breadcrumbAbout}
                  onChange={handleInputChange}
                  placeholder="About"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="breadcrumbCurrent">Breadcrumb Current Text</Label>
                <Input
                  id="breadcrumbCurrent"
                  name="breadcrumbCurrent"
                  value={heroData.breadcrumbCurrent}
                  onChange={handleInputChange}
                  placeholder="Company Culture"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={heroData.isActive}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : (heroId ? 'Update Hero' : 'Create Hero')}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Media Library</h2>
                <button
                  onClick={() => setShowMediaLibrary(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {isLoadingMedia ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : mediaFiles && mediaFiles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No media files found</p>
                  <button 
                    onClick={() => fetchMediaFiles(1)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Refresh Media
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <button 
                      onClick={() => fetchMediaFiles(1)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Refresh Media
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                      Showing {mediaFiles ? mediaFiles.length : 0} media files
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mediaFiles && mediaFiles.map((media, index) => {
                      const mediaUrl = media.url || media.path || 
                        (media.formats && media.formats.thumbnail ? media.formats.thumbnail.url : null) ||
                        (media.formats && media.formats.small ? media.formats.small.url : null) ||
                        (media.formats && media.formats.medium ? media.formats.medium.url : null) ||
                        (media.formats && media.formats.large ? media.formats.large.url : null);
                        
                      const mediaName = media.name || media.filename || media.title || `Media ${index + 1}`;
                      
                      return (
                        <div 
                          key={media._id || media.id || index} 
                          className="border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                          onClick={() => handleMediaSelect(media.url || media)}
                        >
                          <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                            {mediaUrl ? (
                              <img 
                                src={mediaUrl} 
                                alt={mediaName} 
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  console.log('Image load error for:', mediaUrl);
                                  e.target.onerror = null;
                                  e.target.src = '/placeholder-image.jpg';
                                }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-gray-200">
                                <span className="text-gray-500">No preview</span>
                              </div>
                            )}
                          </div>
                          <div className="p-2 text-sm truncate">
                            {mediaName}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              
              {/* Pagination */}
              {totalMediaPages > 1 && (
                <div className="flex justify-center mt-4">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => fetchMediaFiles(mediaPage - 1)}
                      disabled={mediaPage === 1 || isLoadingMedia}
                      className={`px-3 py-1 rounded ${mediaPage === 1 || isLoadingMedia ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                    >
                      Previous
                    </button>
                    
                    <span className="text-sm text-gray-600">
                      Page {mediaPage} of {totalMediaPages}
                    </span>
                    
                    <button
                      onClick={() => fetchMediaFiles(mediaPage + 1)}
                      disabled={mediaPage === totalMediaPages || isLoadingMedia}
                      className={`px-3 py-1 rounded ${mediaPage === totalMediaPages || isLoadingMedia ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyCultureHero;