import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

// Import icons
import { 
  PencilSquareIcon, 
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching products with params:', { page, limit: 10, search });
      
      const response = await productService.getAllProducts({ page, limit: 10, search });
      
      console.log('Products response:', response);
      
      if (response && (response.success || (response.data && response.data.success))) {
        // Handle different response structures
        let productsData = [];
        let totalPagesData = 1;
        let currentPageData = 1;
        
        if (response.success && response.data && Array.isArray(response.data)) {
          // If response.data is directly an array of products
          productsData = response.data;
        } else if (response.success && response.data && response.data.products && Array.isArray(response.data.products)) {
          // If response.data has a products property that is an array
          productsData = response.data.products;
          totalPagesData = response.data.totalPages || response.data.pagination?.totalPages || 1;
          currentPageData = response.data.currentPage || response.data.pagination?.page || 1;
        } else if (response.success && response.data && response.data.data && Array.isArray(response.data.data)) {
          // If response.data has a data property that is an array
          productsData = response.data.data;
          totalPagesData = response.data.totalPages || response.data.pagination?.totalPages || 1;
          currentPageData = response.data.currentPage || response.data.pagination?.page || 1;
        } else if (response.data && response.data.success) {
          // If response.data has a success property
          if (response.data.data && Array.isArray(response.data.data)) {
            productsData = response.data.data;
          }
          if (response.data.pagination) {
            totalPagesData = response.data.pagination.totalPages || 1;
            currentPageData = response.data.pagination.page || 1;
          }
        }
        
        console.log('Processed products data:', { productsData, totalPagesData, currentPageData });
        
        setProducts(productsData);
        setTotalPages(totalPagesData);
        setCurrentPage(currentPageData);
      } else {
        console.error('Failed to fetch products:', response);
        setError('Failed to fetch products');
        toast.error('Failed to fetch products');
        setProducts([]);
      }
    } catch (err) {
      console.error('Products fetch error:', err);
      setError('An error occurred while fetching products');
      toast.error('An error occurred while fetching products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, searchQuery);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await productService.deleteProduct(productToDelete._id);
      
      if (response && response.success) {
        toast.success('Product deleted successfully');
        fetchProducts(currentPage, searchQuery);
      } else {
        toast.error(response?.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Product delete error:', err);
      toast.error('An error occurred while deleting the product');
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
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
                Products
              </h1>
              <p className="text-gray-600 mt-2">Manage your product catalog</p>
            </div>
            <Link
              to="/products/new"
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Product
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-black rounded-lg">
                <CubeIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-black">{products.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-black rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Price</p>
                <p className="text-2xl font-bold text-black">
                  ₹{products.length > 0 
                    ? Math.round(products.reduce((sum, product) => sum + (product.price || 0), 0) / products.length)
                    : 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-black rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-black">
                  {products.filter(product => product.stockQuantity > 0).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-black rounded-lg">
                <TagIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-black">
                  {new Set(products.map(product => product.category?.name).filter(Boolean)).size}
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
                placeholder="Search products by name or description..."
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

        {/* Products Grid */}
        {products.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <CubeIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first product</p>
            <Link
              to="/products/new"
              className="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-black transition-all duration-300 hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CubeIcon className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {/* Price Badge */}
                  {product.price && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-medium">
                        ₹{product.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {truncateText(product.description, 100)}
                  </p>
                  
                  {/* Product Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>SKU: {product.sku || 'N/A'}</span>
                      <span>Stock: {product.stockQuantity || 0}</span>
                    </div>
                    {product.category && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                          {product.category.name}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-xs text-gray-500">
                      <span>Created: {formatDate(product.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Link
                        to={`/products/edit/${product._id}`}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
                        title="Edit product"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete product"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <Link
                      to={`/products/${product._id}`}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
                      title="View product"
                    >
                      <CubeIcon className="w-4 h-4" />
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
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-black mb-4">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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

export default ProductsList;