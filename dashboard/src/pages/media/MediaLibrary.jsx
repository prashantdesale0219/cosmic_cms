import { useState, useEffect, useRef } from 'react';
import { mediaService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { formatDate, formatNumber } from '../../utils/helpers';

// Import icons
import {
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  PhotoIcon,
  DocumentIcon,
  FilmIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const MediaLibrary = () => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMediaDetails, setShowMediaDetails] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const fileInputRef = useRef(null);

  const fetchMedia = async (page = 1, query = searchQuery, sort = sortField, direction = sortDirection, filter = activeFilter) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Fetching media: page=${page}, query=${query}, sort=${sort}, direction=${direction}, filter=${filter}`);
      const response = await mediaService.getAllMedia(page, 20, query, sort, direction, filter);
      console.log('Media API response:', response);
      
      // Handle different response structures
      if (response && response.success) {
        // Direct response structure
        console.log('Processing direct response structure');
        const mediaData = response.data?.media || response.data || response.media || [];
        setMedia(mediaData);
        setTotalPages(response.totalPages || response.pagination?.totalPages || 1);
        setCurrentPage(response.currentPage || response.pagination?.page || 1);
      } else if (response && response.data) {
        // Nested response structure
        console.log('Processing nested response structure');
        if (response.data.success) {
          const mediaData = response.data.data?.media || response.data.data || response.data.media || [];
          setMedia(mediaData);
          setTotalPages(response.data.data?.totalPages || response.data.pagination?.totalPages || response.data.totalPages || 1);
          setCurrentPage(response.data.data?.currentPage || response.data.pagination?.page || response.data.currentPage || 1);
        } else {
          console.error('API returned unsuccessful response:', response.data);
          setMedia([]);
          setError(response.data.message || 'Failed to fetch media');
          toast.error(response.data.message || 'Failed to fetch media');
        }
      } else {
        console.error('Unexpected API response structure:', response);
        setMedia([]);
        setError('Failed to fetch media');
        toast.error('Failed to fetch media');
      }
    } catch (err) {
      console.error('Media fetch error:', err);
      setMedia([]);
      setError('An error occurred while fetching media');
      toast.error('An error occurred while fetching media');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia(currentPage);
  }, [currentPage, sortField, sortDirection, activeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMedia(1, searchQuery);
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

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setShowMediaDetails(true);
  };

  const handleDeleteClick = (media) => {
    setMediaToDelete(media);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mediaToDelete) return;
    
    try {
      console.log(`Deleting media with ID: ${mediaToDelete._id}`);
      const response = await mediaService.deleteMedia(mediaToDelete._id);
      console.log('Media delete API response:', response);
      
      // Handle different response structures
      if (response && response.success) {
        // Direct response structure
        console.log('Processing direct response structure for delete');
        toast.success(response.message || 'Media deleted successfully');
        fetchMedia(currentPage);
        if (showMediaDetails && selectedMedia?._id === mediaToDelete._id) {
          setShowMediaDetails(false);
          setSelectedMedia(null);
        }
      } else if (response && response.data) {
        // Nested response structure
        console.log('Processing nested response structure for delete');
        if (response.data.success) {
          toast.success(response.data.message || 'Media deleted successfully');
          fetchMedia(currentPage);
          if (showMediaDetails && selectedMedia?._id === mediaToDelete._id) {
            setShowMediaDetails(false);
            setSelectedMedia(null);
          }
        } else {
          console.error('API returned unsuccessful response for delete:', response.data);
          toast.error(response.data.message || 'Failed to delete media');
        }
      } else {
        console.error('Unexpected API response structure for delete:', response);
        toast.error('Failed to delete media');
      }
    } catch (err) {
      console.error('Media delete error:', err);
      toast.error('An error occurred while deleting the media');
    } finally {
      setShowDeleteModal(false);
      setMediaToDelete(null);
    }
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      console.log(`Uploading ${files.length} file(s)`);
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        console.log(`Adding file to upload: ${files[i].name} (${files[i].type}, ${files[i].size} bytes)`);
        formData.append('files', files[i]);
      }
      
      const response = await mediaService.uploadMedia(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
        console.log(`Upload progress: ${percentCompleted}%`);
      });
      
      console.log('Media upload API response:', response);
      
      // Handle different response structures
      if (response && response.success) {
        // Direct response structure
        console.log('Processing direct response structure for upload');
        toast.success(response.message || `${files.length > 1 ? `${files.length} files` : 'File'} uploaded successfully`);
        fetchMedia(currentPage);
      } else if (response && response.data) {
        // Nested response structure
        console.log('Processing nested response structure for upload');
        if (response.data.success) {
          toast.success(response.data.message || `${files.length > 1 ? `${files.length} files` : 'File'} uploaded successfully`);
          fetchMedia(currentPage);
        } else {
          console.error('API returned unsuccessful response for upload:', response.data);
          toast.error(response.data.message || 'Failed to upload files');
        }
      } else {
        console.error('Unexpected API response structure for upload:', response);
        toast.error('Failed to upload files');
      }
    } catch (err) {
      console.error('Media upload error:', err);
      toast.error('An error occurred while uploading files');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    uploadFiles(files);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Copied to clipboard');
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy to clipboard');
      }
    );
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return <PhotoIcon className="h-8 w-8 text-blue-500" />;
    } else if (type.startsWith('video/')) {
      return <FilmIcon className="h-8 w-8 text-purple-500" />;
    } else if (type.startsWith('audio/')) {
      return <MusicalNoteIcon className="h-8 w-8 text-pink-500" />;
    } else if (type.startsWith('application/pdf')) {
      return <DocumentIcon className="h-8 w-8 text-red-500" />;
    } else if (type.includes('zip') || type.includes('compressed') || type.includes('archive')) {
      return <ArchiveBoxIcon className="h-8 w-8 text-yellow-500" />;
    } else {
      return <DocumentIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="py-6" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Media Library</h1>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading ({uploadProgress}%)
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                  Upload Files
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                <form onSubmit={handleSearch} className="flex w-full md:max-w-md">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search media..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Search
                  </button>
                </form>

                <div className="flex space-x-2">
                  <div className="inline-flex shadow-sm rounded-md">
                    <button
                      type="button"
                      onClick={() => handleViewModeChange('grid')}
                      className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${viewMode === 'grid' ? 'bg-primary-50 text-primary-700 z-10' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewModeChange('list')}
                      className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${viewMode === 'list' ? 'bg-primary-50 text-primary-700 z-10' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleFilterChange('all')}
                  className={`inline-flex items-center px-3 py-1.5 border ${activeFilter === 'all' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} rounded-md text-sm font-medium`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange('image')}
                  className={`inline-flex items-center px-3 py-1.5 border ${activeFilter === 'image' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} rounded-md text-sm font-medium`}
                >
                  <PhotoIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                  Images
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange('video')}
                  className={`inline-flex items-center px-3 py-1.5 border ${activeFilter === 'video' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} rounded-md text-sm font-medium`}
                >
                  <FilmIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                  Videos
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange('audio')}
                  className={`inline-flex items-center px-3 py-1.5 border ${activeFilter === 'audio' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} rounded-md text-sm font-medium`}
                >
                  <MusicalNoteIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                  Audio
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange('document')}
                  className={`inline-flex items-center px-3 py-1.5 border ${activeFilter === 'document' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} rounded-md text-sm font-medium`}
                >
                  <DocumentIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                  Documents
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange('other')}
                  className={`inline-flex items-center px-3 py-1.5 border ${activeFilter === 'other' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} rounded-md text-sm font-medium`}
                >
                  <ArchiveBoxIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                  Other
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : media.length > 0 ? (
              <div>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                    {media.map((item) => (
                      <div 
                        key={item._id} 
                        className="group relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => handleMediaClick(item)}
                      >
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
                          {item.type.startsWith('image/') ? (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {getFileIcon(item.type)}
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(item.url);
                              }}
                              className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                              title="Copy URL"
                            >
                              <DocumentDuplicateIcon className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(item);
                              }}
                              className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            File
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center">
                              <span>Name</span>
                              {sortField === 'name' && (
                                <span className="ml-2">
                                  {sortDirection === 'asc' ? (
                                    <ArrowUpIcon className="h-4 w-4" />
                                  ) : (
                                    <ArrowDownIcon className="h-4 w-4" />
                                  )}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('type')}
                          >
                            <div className="flex items-center">
                              <span>Type</span>
                              {sortField === 'type' && (
                                <span className="ml-2">
                                  {sortDirection === 'asc' ? (
                                    <ArrowUpIcon className="h-4 w-4" />
                                  ) : (
                                    <ArrowDownIcon className="h-4 w-4" />
                                  )}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('size')}
                          >
                            <div className="flex items-center">
                              <span>Size</span>
                              {sortField === 'size' && (
                                <span className="ml-2">
                                  {sortDirection === 'asc' ? (
                                    <ArrowUpIcon className="h-4 w-4" />
                                  ) : (
                                    <ArrowDownIcon className="h-4 w-4" />
                                  )}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('createdAt')}
                          >
                            <div className="flex items-center">
                              <span>Uploaded</span>
                              {sortField === 'createdAt' && (
                                <span className="ml-2">
                                  {sortDirection === 'asc' ? (
                                    <ArrowUpIcon className="h-4 w-4" />
                                  ) : (
                                    <ArrowDownIcon className="h-4 w-4" />
                                  )}
                                </span>
                              )}
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {media.map((item) => (
                          <tr key={item._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleMediaClick(item)}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                                {item.type.startsWith('image/') ? (
                                  <img
                                    src={item.url}
                                    alt={item.name}
                                    className="h-10 w-10 object-cover"
                                  />
                                ) : (
                                  getFileIcon(item.type)
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{item.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{item.type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{formatFileSize(item.size)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{formatDate(item.createdAt)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => copyToClipboard(item.url)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Copy URL"
                                >
                                  <DocumentDuplicateIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(item)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete"
                                >
                                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{media.length > 0 ? (currentPage - 1) * 20 + 1 : 0}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(currentPage * 20, (totalPages - 1) * 20 + media.length)}
                          </span>{' '}
                          of <span className="font-medium">{(totalPages - 1) * 20 + media.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => handlePageChange(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1 ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No media files found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? 'No media files match your search criteria.' : 'Get started by uploading a file.'}
                </p>
                {!searchQuery && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <ArrowUpTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Upload a file
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Details Modal */}
      {showMediaDetails && selectedMedia && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Media Details
                  </h3>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => {
                      setShowMediaDetails(false);
                      setSelectedMedia(null);
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-2">
                      {selectedMedia.type.startsWith('image/') ? (
                        <img
                          src={selectedMedia.url}
                          alt={selectedMedia.name}
                          className="max-w-full max-h-64 object-contain"
                        />
                      ) : selectedMedia.type.startsWith('video/') ? (
                        <video
                          src={selectedMedia.url}
                          controls
                          className="max-w-full max-h-64"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : selectedMedia.type.startsWith('audio/') ? (
                        <audio
                          src={selectedMedia.url}
                          controls
                          className="w-full"
                        >
                          Your browser does not support the audio tag.
                        </audio>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6">
                          {getFileIcon(selectedMedia.type)}
                          <p className="mt-2 text-sm text-gray-500">Preview not available</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <dl className="divide-y divide-gray-200">
                        <div className="py-3 flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Name</dt>
                          <dd className="text-sm text-gray-900 text-right">{selectedMedia.name}</dd>
                        </div>
                        <div className="py-3 flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Type</dt>
                          <dd className="text-sm text-gray-900 text-right">{selectedMedia.type}</dd>
                        </div>
                        <div className="py-3 flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Size</dt>
                          <dd className="text-sm text-gray-900 text-right">{formatFileSize(selectedMedia.size)}</dd>
                        </div>
                        <div className="py-3 flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                          <dd className="text-sm text-gray-900 text-right">
                            {selectedMedia.width && selectedMedia.height
                              ? `${selectedMedia.width} × ${selectedMedia.height}`
                              : 'N/A'}
                          </dd>
                        </div>
                        <div className="py-3 flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Uploaded</dt>
                          <dd className="text-sm text-gray-900 text-right">{formatDate(selectedMedia.createdAt)}</dd>
                        </div>
                        <div className="py-3">
                          <dt className="text-sm font-medium text-gray-500 mb-1">URL</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <div className="flex">
                              <input
                                type="text"
                                readOnly
                                value={selectedMedia.url}
                                className="flex-grow shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => copyToClipboard(selectedMedia.url)}
                                className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                <DocumentDuplicateIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
                                Copy
                              </button>
                            </div>
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-4 flex space-x-3">
                        <a
                          href={selectedMedia.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Open in New Tab
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(selectedMedia)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <TrashIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Delete Media
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this media file? This action cannot be undone.
                      {mediaToDelete?.name && (
                        <span className="block mt-2 font-medium">"{mediaToDelete.name}"</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setMediaToDelete(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;