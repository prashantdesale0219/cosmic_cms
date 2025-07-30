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
  EyeIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChartBarIcon,
  TagIcon,
  FolderIcon
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
          categoriesData = response.data;
        } else if (response.data && response.data.categories && Array.isArray(response.data.categories)) {
          categoriesData = response.data.categories;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        }
        
        setCategories(categoriesData);
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
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
          tagsData = response.data;
        } else if (response.data && response.data.tags && Array.isArray(response.data.tags)) {
          tagsData = response.data.tags;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          tagsData = response.data.data;
        }
        
        setTags(tagsData);
      }
    } catch (err) {
      console.error('Tags fetch error:', err);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, searchTerm, selectedCategory, selectedTag);
    fetchCategories();
    fetchTags();
  }, [currentPage, searchTerm, selectedCategory, selectedTag]);

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
      
      if (response && response.success) {
        toast.success('Blog post deleted successfully');
        fetchPosts(currentPage, searchTerm, selectedCategory, selectedTag);
      } else {
        toast.error(response?.message || 'Failed to delete blog post');
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
                Blog Posts
              </h1>
              <p className="text-gray-600 mt-2">Manage your website's blog content</p>
            </div>
            <Link
              to="/posts/new"
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Post
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-black rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-black">{posts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-black rounded-lg">
                <FolderIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-black">{categories.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-black rounded-lg">
                <TagIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tags</p>
                <p className="text-2xl font-bold text-black">{tags.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-black rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-black">{posts.filter(post => post.isPublished).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts by title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-200"
              >
                Search
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedTag}
                onChange={handleTagChange}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag._id} value={tag._id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Posts Grid */}
        {posts.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <DocumentTextIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first blog post</p>
            <Link
              to="/posts/new"
              className="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-black transition-all duration-300 hover:shadow-xl"
              >
                {/* Post Image */}
                <div className="relative h-48 bg-gray-100">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <DocumentTextIcon className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.isPublished 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  {/* Category Badge */}
                  {post.category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-medium">
                        {post.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {truncateText(post.excerpt || post.content, 120)}
                  </p>
                  
                  {/* Post Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {post.publishedAt ? format(new Date(post.publishedAt), 'MMM dd, yyyy') : 'Not published'}
                    </div>
                    {post.author && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                          {post.author.name || post.author}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag._id || tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag.name || tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Link
                        to={`/posts/edit/${post._id}`}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
                        title="Edit post"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => confirmDelete(post)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete post"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <Link
                      to={`/posts/${post._id}`}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
                      title="View post"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
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
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-black mb-4">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{postToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostsList;