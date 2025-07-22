import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

// Import icons
import { 
  PencilSquareIcon, 
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const fetchProjects = async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Fetching projects: page=${page}, search=${search}`);
      const response = await projectService.getProjects(page, 10, search);
      console.log('Projects response:', response);
      
      if (response && response.success) {
        // Handle different response formats
        if (response.data && response.data.projects) {
          // Standard format with projects array
          setProjects(response.data.projects);
          setTotalPages(response.data.totalPages || 1);
          setCurrentPage(response.data.currentPage || 1);
        } else if (response.data && Array.isArray(response.data)) {
          // Direct array format
          setProjects(response.data);
          setTotalPages(response.totalPages || 1);
          setCurrentPage(response.currentPage || 1);
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Nested data format
          setProjects(response.data.data);
          setTotalPages(response.data.totalPages || 1);
          setCurrentPage(response.data.currentPage || 1);
        } else {
          console.warn('Unexpected projects data format:', response.data);
          setProjects([]);
          setError('Received unexpected data format from server');
          toast.error('Received unexpected data format from server');
        }
      } else {
        console.error('Failed to fetch projects:', response);
        setProjects([]);
        setError(response?.message || 'Failed to fetch projects');
        toast.error(response?.message || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Projects fetch error:', err);
      setProjects([]);
      setError('An error occurred while fetching projects');
      toast.error('An error occurred while fetching projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of projects when component mounts
    fetchProjects(currentPage, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = async (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    await fetchProjects(page, searchQuery);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProjects(1, searchQuery);
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      console.log(`Deleting project with ID: ${projectToDelete._id}`);
      const response = await projectService.deleteProject(projectToDelete._id);
      console.log('Project deletion response:', response);
      
      if (response && response.success) {
        toast.success(response.message || 'Project deleted successfully');
        fetchProjects(currentPage, searchQuery);
      } else {
        console.error('Failed to delete project:', response);
        toast.error(response?.message || 'Failed to delete project');
      }
    } catch (err) {
      console.error('Project delete error:', err);
      toast.error(err?.message || 'An error occurred while deleting the project');
    } finally {
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <Link
            to="/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Project
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Search */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex w-full md:max-w-md">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search projects..."
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
          
          {/* Error message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <>
              {/* Projects table */}
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Project
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Client
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Created At
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {projects.length > 0 ? (
                            projects.map((project) => (
                              <tr key={project._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      {project.image ? (
                                        <img
                                          className="h-10 w-10 rounded-full object-cover"
                                          src={project.image}
                                          alt={project.title}
                                        />
                                      ) : (
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                          <span className="text-xs">No img</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {project.title}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {project.slug}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {project.client || 'N/A'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'completed' ? 'bg-green-100 text-green-800' : project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}
                                  >
                                    {project.status === 'completed' ? 'Completed' : 
                                     project.status === 'ongoing' ? 'Ongoing' : 
                                     project.status === 'upcoming' ? 'Upcoming' : 'Draft'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(project.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <Link
                                      to={`/projects/edit/${project._id}`}
                                      className="text-primary-600 hover:text-primary-900"
                                    >
                                      <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                                    </Link>
                                    <button
                                      onClick={() => handleDeleteClick(project)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                No projects found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border rounded-md text-sm ${currentPage === page ? 'bg-primary-600 text-white' : 'border-gray-300 text-gray-700'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
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
                  <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Delete Project
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the project "{projectToDelete?.title}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
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

export default ProjectsList;