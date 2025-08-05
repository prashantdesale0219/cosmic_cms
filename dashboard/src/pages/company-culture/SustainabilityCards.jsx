import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import mediaService from '../../services/mediaService';

const SustainabilityCards = () => {
  const [sustainabilityCards, setSustainabilityCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    imageAlt: '',
    category: 'Environmental',
    order: 0,
    isActive: true
  });
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);

  const categoryOptions = [
    { value: 'Environmental', label: 'Environmental' },
    { value: 'Society', label: 'Society' },
    { value: 'Governance', label: 'Governance' }
  ];

  useEffect(() => {
    fetchSustainabilityCards();
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
    setFormData(prev => ({
      ...prev,
      image: mediaUrl
    }));
    setShowMediaLibrary(false);
  };

  const openMediaLibrary = () => {
    setShowMediaLibrary(true);
    fetchMediaFiles(1);
  };

  const fetchSustainabilityCards = async () => {
    try {
      const response = await api.get('/company-culture/sustainability-cards');
      if (response.data.success) {
        setSustainabilityCards(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sustainability cards:', error);
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
      if (editingCard) {
        response = await api.put(`/company-culture/sustainability-cards/${editingCard._id}`, formData);
      } else {
        response = await api.post('/company-culture/sustainability-cards', formData);
      }

      if (response.data.success) {
        toast.success(editingCard ? 'Sustainability card updated successfully!' : 'Sustainability card created successfully!');
        fetchSustainabilityCards();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving sustainability card:', error);
      toast.error('Failed to save sustainability card');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      description: card.description,
      image: card.image,
      imageAlt: card.imageAlt,
      category: card.category,
      order: card.order,
      isActive: card.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sustainability card?')) {
      try {
        await api.delete(`/company-culture/sustainability-cards/${id}`);
        toast.success('Sustainability card deleted successfully!');
        fetchSustainabilityCards();
      } catch (error) {
        console.error('Error deleting sustainability card:', error);
        toast.error('Failed to delete sustainability card');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      imageAlt: '',
      category: 'Environmental',
      order: 0,
      isActive: true
    });
    setEditingCard(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sustainability Cards Management</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Sustainability Card
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingCard ? 'Edit Sustainability Card' : 'Add New Sustainability Card'}</CardTitle>
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
                    placeholder="Environmental"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="/enviroment.jpeg"
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
                  {formData.image && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
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
                    value={formData.imageAlt}
                    onChange={handleInputChange}
                    placeholder="Solar panels with city buildings"
                    required
                  />
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
                  placeholder="We prioritize environmental stewardship by utilizing renewable energy sources..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingCard ? 'Update' : 'Create')}
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
        {sustainabilityCards.map((card) => (
          <Card key={card._id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <GripVertical className="h-5 w-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{card.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {card.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{card.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Order: {card.order}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        card.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {card.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {card.image && (
                      <div className="mt-2">
                        <img 
                          src={card.image} 
                          alt={card.imageAlt} 
                          className="w-20 h-12 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(card)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(card._id)}
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

      {sustainabilityCards.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No sustainability cards found. Add your first sustainability card to get started.</p>
          </CardContent>
        </Card>
      )}
      
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

export default SustainabilityCards;