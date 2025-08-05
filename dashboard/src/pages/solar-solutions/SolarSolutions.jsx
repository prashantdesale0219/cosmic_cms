import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { solarSolutionService } from '../../services/solarSolutionService';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import ConfirmModal from '../../components/ConfirmModal';
import { formatDate } from '../../utils/helpers';

const SolarSolutions = () => {
  // State management
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [solutionToDelete, setSolutionToDelete] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // Fetch solar solutions
  const fetchSolutions = async (page = 1, search = searchQuery) => {
    setLoading(true);
    try {
      const response = await solarSolutionService.getSolarSolutions(page, limit, search);
      if (response.success) {
        setSolutions(response.data);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
        setTotalItems(response.total);
      } else {
        setError(response.message || 'Failed to fetch solar solutions');
        toast.error(response.message || 'Failed to fetch solar solutions');
      }
    } catch (err) {
      console.error('Error fetching solar solutions:', err);
      setError('Failed to fetch solar solutions');
      toast.error('Failed to fetch solar solutions');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSolutions(1);
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchSolutions(page);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchSolutions(1, searchQuery);
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle delete confirmation
  const handleDeleteClick = (solution) => {
    setSolutionToDelete(solution);
    setShowDeleteModal(true);
  };

  // Handle delete cancellation
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSolutionToDelete(null);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!solutionToDelete) return;

    try {
      const response = await solarSolutionService.deleteSolarSolution(solutionToDelete._id);
      if (response.success) {
        toast.success(response.message || 'Solar solution deleted successfully');
        // Refresh the list
        fetchSolutions(currentPage);
      } else {
        toast.error(response.message || 'Failed to delete solar solution');
      }
    } catch (err) {
      console.error('Error deleting solar solution:', err);
      toast.error('Failed to delete solar solution');
    } finally {
      setShowDeleteModal(false);
      setSolutionToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Solar Solutions</h1>
        <Link
          to="/solar-solutions/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Solution
        </Link>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search solar solutions..."
            className="border border-gray-300 rounded-l px-4 py-2 w-full"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r flex items-center"
          >
            <FaSearch className="mr-2" /> Search
          </button>
        </form>
      </div>

      {/* Loading state */}
      {loading && <Loader />}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && solutions.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          No solar solutions found. {searchQuery && 'Try a different search term or'}{' '}
          <Link to="/solar-solutions/new" className="underline">
            create a new solution
          </Link>
          .
        </div>
      )}

      {/* Solutions list */}
      {!loading && !error && solutions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Title</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Image</th>
                <th className="py-2 px-4 border-b text-left">Category</th>
                <th className="py-2 px-4 border-b text-left">Order</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Created At</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {solutions.map((solution) => (
                <tr key={solution._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{solution.title}</td>
                  <td className="py-2 px-4 border-b">
                    {solution.description && solution.description.length > 50
                      ? `${solution.description.substring(0, 50)}...`
                      : solution.description}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {solution.image ? (
                      <img
                        src={solution.image}
                        alt={solution.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      'No image'
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{solution.category}</td>
                  <td className="py-2 px-4 border-b">{solution.order || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded text-xs ${solution.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {solution.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {solution.createdAt ? formatDate(solution.createdAt) : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <Link
                        to={`/solar-solutions/edit/${solution._id}`}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(solution)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={limit}
        />
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && solutionToDelete && (
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Confirm Delete"
          message={`Are you sure you want to delete the solar solution "${solutionToDelete.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default SolarSolutions;