import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { heroService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { formatDate, truncateText } from '../../utils/helpers';

// Import icons
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PhotoIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const HeroSlidesList = () => {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const [sortField, setSortField] = useState('order');
  const [sortDirection, setSortDirection] = useState('asc');

  const fetchSlides = async (page = 1, query = searchQuery, sort = sortField, direction = sortDirection) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await heroService.getAllSlides({ page, limit: 10, search: query, sort, direction });
      
      if (response.data && response.data.success) {
        setSlides(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(response.data.pagination.page);
      } else {
        setError('Failed to fetch hero slides');
        toast.error('Failed to fetch hero slides');
      }
    } catch (err) {
      console.error('Hero slides fetch error:', err);
      setError('An error occurred while fetching hero slides');
      toast.error('An error occurred while fetching hero slides');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides(currentPage);
  }, [currentPage, sortField, sortDirection]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSlides(1, searchQuery);
  };

  const handleSort = (field) => {
    const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleDeleteClick = (slide) => {
    setSlideToDelete(slide);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!slideToDelete) return;
    
    try {
      const response = await heroService.deleteSlide(slideToDelete._id);
      
      if (response.data && response.data.success) {
        toast.success('Hero slide deleted successfully');
        fetchSlides(currentPage);
      } else {
        toast.error(response.data?.message || 'Failed to delete hero slide');
      }
    } catch (err) {
      console.error('Hero slide delete error:', err);
      toast.error('An error occurred while deleting the hero slide');
    } finally {
      setShowDeleteModal(false);
      setSlideToDelete(null);
    }
  };

  const handleReorder = async (slideId, newOrder) => {
    try {
      const response = await heroService.updateSlideOrder(slideId, { order: newOrder });
      
      if (response.data && response.data.success) {
        toast.success('Slide order updated successfully');
        fetchSlides(currentPage);
      } else {
        toast.error('Failed to update slide order');
      }
    } catch (err) {
      console.error('Reorder error:', err);
      toast.error('An error occurred while reordering slides');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg mb-6 w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-6 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">
                Hero Slides
              </h1>
              <p className="text-gray-600 mt-2">Manage your website's hero section slides</p>
            </div>
            <Link
              to="/hero-slides/new"
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Slide
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-black rounded-lg">
                <PhotoIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Slides</p>
                <p className="text-2xl font-bold text-black">{slides.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-black rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Slides</p>
                <p className="text-2xl font-bold text-black">{slides.filter(slide => slide.isActive).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-black rounded-lg">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-lg font-semibold text-black">
                  {slides.length > 0 ? formatDate(slides[0].updatedAt) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search slides by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-200"
            >
              Search
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Slides Grid */}
        {slides.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <PhotoIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No slides found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first hero slide</p>
            <Link
              to="/hero-slides/new"
              className="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create First Slide
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide, index) => (
              <div
                key={slide._id}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-black transition-all duration-300 hover:shadow-xl"
              >
                {/* Slide Image */}
                <div className="relative h-48 bg-gray-100">
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PhotoIcon className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      slide.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {/* Order Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-medium">
                      #{slide.order || index + 1}
                    </span>
                  </div>
                </div>

                {/* Slide Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-gray-700 transition-colors duration-200">
                    {slide.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {truncateText(slide.description, 100)}
                  </p>
                  
                  {/* Slide Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Created: {formatDate(slide.createdAt)}
                    </div>
                    {slide.buttonText && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                          {slide.buttonText}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Link
                        to={`/hero-slides/edit/${slide._id}`}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
                        title="Edit slide"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(slide)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete slide"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Reorder Controls */}
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleReorder(slide._id, (slide.order || index + 1) - 1)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-200"
                        title="Move up"
                      >
                        <ArrowUpIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReorder(slide._id, (slide.order || index + 1) + 1)}
                        disabled={index === slides.length - 1}
                        className="p-1 text-gray-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-200"
                        title="Move down"
                      >
                        <ArrowDownIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl p-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-gray-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-black text-white'
                      : 'text-gray-500 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-gray-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-black mb-4">Delete Slide</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{slideToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSlidesList;