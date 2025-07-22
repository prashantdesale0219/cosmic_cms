import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { energySolutionService } from '../../services/energySolutionService';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';


const EnergySolutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [solutionToDelete, setSolutionToDelete] = useState(null);

  const fetchSolutions = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await energySolutionService.getEnergySolutions(page, search);
      setSolutions(response.data);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.currentPage || page);
    } catch (err) {
      console.error('Error fetching energy solutions:', err);
      setError('Failed to fetch energy solutions. Please try again later.');
      toast.error('Failed to fetch energy solutions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions(currentPage, searchQuery);
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      await energySolutionService.deleteEnergySolution(id);
      toast.success('Energy solution deleted successfully');
      fetchSolutions(currentPage, searchQuery);
      setShowDeleteModal(false);
      setSolutionToDelete(null);
    } catch (err) {
      console.error('Error deleting energy solution:', err);
      toast.error('Failed to delete energy solution');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSolutions(1, searchQuery);
  };

  const confirmDelete = (solution) => {
    setSolutionToDelete(solution);
    setShowDeleteModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Energy Solutions</h1>
        <Link
          to="/dashboard/energy-solutions/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Solution
        </Link>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search energy solutions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 text-gray-600 hover:text-gray-800"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
          <button
            type="submit"
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r-md"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading energy solutions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      ) : solutions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No energy solutions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {solutions.map((solution) => (
                <tr key={solution._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {solution.image && (
                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={solution.image}
                            alt={solution.title}
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{solution.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        solution.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {solution.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(solution.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/dashboard/energy-solutions/edit/${solution._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => confirmDelete(solution)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
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
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          title="Confirm Delete"
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="p-6">
            <p className="mb-4">
              Are you sure you want to delete the energy solution "{solutionToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(solutionToDelete?._id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EnergySolutions;