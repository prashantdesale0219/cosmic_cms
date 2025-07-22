import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService, categoryService, tagService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

// Import icons
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const BlogPostsList = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  
  const fetchPosts = async (page = 1, search = '', category = '', tag = '') => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching blog posts with params:', { page, limit: 10, search, category, tag });
      
      const response = await blogService.getAllPosts({
        page,
        limit: 10,
        search,
        category,
        tag
      });
      
      console.log('Blog posts response:', response);
      
      if (response && response.success) {
        // Handle standardized response format
        let postsData = [];
        let totalPagesData = 1;
        let currentPageData = 1;
        
        // Check different possible response structures
        if (response.data && Array.isArray(response.data)) {
          // If response.data is directly an array of posts
          postsData = response.data;
        } else if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
          // If response.data has a posts property that is an array
          postsData = response.data.posts;
          totalPagesData = response.data.totalPages || response.data.pagination?.totalPages || 1;
          currentPageData = response.data.currentPage || response.data.pagination?.page || 1;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // If response.data has a data property that is an array
          postsData = response.data.data;
          totalPagesData = response.data.totalPages || response.data.pagination?.totalPages || 1;
          currentPageData = response.data.currentPage || response.data.pagination?.page || 1;
        }
        
        console.log('Processed posts data:', { postsData, totalPagesData, currentPageData });
        
        setPosts(postsData);
        setTotalPages(totalPagesData);
        setCurrentPage(currentPageData);
      } else {
        console.error('Failed to fetch blog posts:', response);
        setError(response?.message || 'Failed to load blog posts');
        setPosts([]);
      }
    } catch (err) {
      console.error('Blog posts fetch error:', err);
      setError('An error occurred while loading blog posts');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      console.log('Categories response:', response);
      
      if (response && response.success) {
        // Handle different response structures
        let categoriesData = [];
        
        if (response.data && Array.isArray(response.data)) {
          // If response.data is directly an array
          categoriesData = response.data;
        } else if (response.data && response.data.categories && Array.isArray(response.data.categories)) {
          // If response.data has a categories property that is an array
          categoriesData = response.data.categories;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // If response.data has a data property that is an array
          categoriesData = response.data.data;
        }
        
        console.log('Processed categories data:', categoriesData);
        setCategories(categoriesData);
      } else {
        console.error('Failed to fetch categories:', response);
        setCategories([]);
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
      setCategories([]);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await tagService.getAllTags();
      console.log('Tags response:', response);
      
      if (response && response.success) {
        // Handle different response structures
        let tagsData = [];
        
        if (response.data && Array.isArray(response.data)) {
          // If response.data is directly an array
          tagsData = response.data;
        } else if (response.data && response.data.tags && Array.isArray(response.data.tags)) {
          // If response.data has a tags property that is an array
          tagsData = response.data.tags;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // If response.data has a data property that is an array
          tagsData = response.data.data;
        }
        
        console.log('Processed tags data:', tagsData);
        setTags(tagsData);
      } else {
        console.error('Failed to fetch tags:', response);
        setTags([]);
      }
    } catch (err) {
      console.error('Tags fetch error:', err);
      setTags([]);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, searchTerm, selectedCategory, selectedTag);
    fetchCategories();
    fetchTags();
  }, [currentPage, searchTerm, selectedCategory, selectedTag]);
  
  // Initial data fetch
  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts(1, searchTerm, selectedCategory, selectedTag);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
    fetchPosts(1, searchTerm, e.target.value, selectedTag);
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
    setCurrentPage(1);
    fetchPosts(1, searchTerm, selectedCategory, e.target.value);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const confirmDelete = (post) => {
    setPostToDelete(post);
  };

  const cancelDelete = () => {
    setPostToDelete(null);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    
    try {
      setIsDeleting(true);
      
      const response = await blogService.deletePost(postToDelete._id);
      
      if (response.success) {
        toast.success(response.message || 'Blog post deleted successfully');
        fetchPosts(currentPage, searchTerm, selectedCategory, selectedTag);
      } else {
        toast.error(response.message || 'Failed to delete blog post');
      }
    } catch (err) {
      console.error('Blog post delete error:', err);
      toast.error('An error occurred while deleting the blog post');
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
          <Link
            to="/posts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Post
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="w-full md:w-48">
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={selectedTag}
                    onChange={handleTagChange}
                  >
                    <option value="">All Tags</option>
                    {tags.map((tag) => (
                      <option key={tag._id} value={tag._id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Search
                </button>
              </form>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <li key={post._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            {post.featuredImage && (
                              <div className="flex-shrink-0 h-16 w-16 mr-4">
                                <img 
                                  className="h-16 w-16 rounded-md object-cover" 
                                  src={post.featuredImage} 
                                  alt={post.title} 
                                />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-primary-600">{post.title}</div>
                              <div className="text-sm text-gray-500 mt-1">{truncateText(post.excerpt || post.content)}</div>
                              <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500">
                                <span className="mr-3">
                                  {post.author ? post.author.name : 'Unknown'}
                                </span>
                                <span className="mr-3">
                                  {post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : 'Unknown date'}
                                </span>
                                {post.category && (
                                  <span className="mr-3 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                    {post.category.name}
                                  </span>
                                )}
                                {post.tags && post.tags.map(tag => (
                                  <span key={tag._id} className="mr-2 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                                    {tag.name}
                                  </span>
                                ))}
                                <span className={`mr-3 px-2 py-0.5 rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center space-x-2">
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                          </a>
                          <Link
                            to={`/posts/${post._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                          </Link>
                          <button
                            onClick={() => confirmDelete(post)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-5 text-center text-gray-500">
                  No blog posts found
                </li>
              )}
            </ul>
            
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
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
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {[...Array(totalPages).keys()].map((page) => (
                        <button
                          key={page + 1}
                          onClick={() => handlePageChange(page + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page + 1 ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                        >
                          {page + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
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
      {postToDelete && (
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
                    Delete Blog Post
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the blog post "{postToDelete.title}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={isDeleting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDelete}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={cancelDelete}
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

export default BlogPostsList;