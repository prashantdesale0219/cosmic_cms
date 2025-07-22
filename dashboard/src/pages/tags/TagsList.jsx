import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tagService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

// Import icons
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const TagsList = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const fetchTags = async (page = 1, query = searchQuery, sort = sortField, direction = sortDirection) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching tags with params:', { page, limit: 10, search: query, sort, direction });
      
      const response = await tagService.getTags(page, 10, query, sort, direction);
      
      console.log('Tags response:', response);
      
      if (response && response.success) {
        // Handle different response structures
        let tagsData = [];
        let totalPagesData = 1;
        let currentPageData = 1;
        
        if (response.data && Array.isArray(response.data)) {
          // If response.data is directly an array of tags
          tagsData = response.data;
        } else if (response.data && response.data.tags && Array.isArray(response.data.tags)) {
          // If response.data has a tags property that is an array
          tagsData = response.data.tags;
          totalPagesData = response.data.totalPages || response.data.pagination?.totalPages || 1;
          currentPageData = response.data.currentPage || response.data.pagination?.page || 1;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // If response.data has a data property that is an array
          tagsData = response.data.data;
          totalPagesData = response.data.totalPages || response.data.pagination?.totalPages || 1;
          currentPageData = response.data.currentPage || response.data.pagination?.page || 1;
        }
        
        console.log('Processed tags data:', { tagsData, totalPagesData, currentPageData });
        
        setTags(tagsData);
        setTotalPages(totalPagesData);
        setCurrentPage(currentPageData);
      } else {
        console.error('Failed to fetch tags:', response);
        setError('Failed to fetch tags');
        toast.error('Failed to fetch tags');
        setTags([]);
      }
    } catch (err) {
      console.error('Tags fetch error:', err);
      setError('An error occurred while fetching tags');
      toast.error('An error occurred while fetching tags');
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags(currentPage);
  }, [currentPage, sortField, sortDirection]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTags(1, searchQuery);
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

  const handleDeleteClick = (tag) => {
    setTagToDelete(tag);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tagToDelete) return;
    
    try {
      console.log('Deleting tag with ID:', tagToDelete._id);
      
      const response = await tagService.deleteTag(tagToDelete._id);
      
      console.log('Delete tag response:', response);
      
      if (response && response.success) {
        toast.success(response.message || 'Tag deleted successfully');
        fetchTags(currentPage);
      } else {
        console.error('Failed to delete tag:', response);
        toast.error(response?.message || 'Failed to delete tag');
      }
    } catch (err) {
      console.error('Tag delete error:', err);
      toast.error('An error occurred while deleting the tag');
    } finally {
      setShowDeleteModal(false);
      setTagToDelete(null);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Tags</h1>
          <Link
            to="/tags/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add New Tag
          </Link>
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

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
              <form onSubmit={handleSearch} className="flex w-full md:max-w-md">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search tags..."
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
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : tags.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
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
                        onClick={() => handleSort('slug')}
                      >
                        <div className="flex items-center">
                          <span>Slug</span>
                          {sortField === 'slug' && (
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
                        onClick={() => handleSort('count')}
                      >
                        <div className="flex items-center">
                          <span>Count</span>
                          {sortField === 'count' && (
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
                          <span>Created</span>
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tags.map((tag) => (
                      <tr key={tag._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tag.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tag.slug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tag.count || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(tag.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/tags/edit/${tag._id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <PencilIcon className="h-5 w-5" aria-hidden="true" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(tag)}
                              className="text-red-600 hover:text-red-900"
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
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tags found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new tag.
                </p>
                <div className="mt-6">
                  <Link
                    to="/tags/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add New Tag
                  </Link>
                </div>
              </div>
            )}

            {tags.length > 0 && totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{tags.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * 10, (totalPages - 1) * 10 + tags.length)}
                      </span>{' '}
                      of <span className="font-medium">{(totalPages - 1) * 10 + tags.length}</span> results
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
        </div>
      </div>

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
                    Delete Tag
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this tag? This action cannot be undone.
                      All content associated with this tag may be affected.
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
                    setTagToDelete(null);
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

export default TagsList;