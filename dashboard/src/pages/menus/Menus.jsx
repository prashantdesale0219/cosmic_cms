import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { menuService } from '../../services/api';
import { toast } from 'react-hot-toast';

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const response = await menuService.getMenus();
      if (response.success) {
        setMenus(response.data);
      } else {
        toast.error('Failed to fetch menus');
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast.error('An error occurred while fetching menus');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (menu) => {
    setMenuToDelete(menu);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!menuToDelete) return;

    try {
      setIsLoading(true);
      const response = await menuService.deleteMenu(menuToDelete._id);
      if (response.success) {
        toast.success('Menu deleted successfully');
        fetchMenus();
      } else {
        toast.error(response.message || 'Failed to delete menu');
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('An error occurred while deleting the menu');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setMenuToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setMenuToDelete(null);
  };

  if (isLoading && menus.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Navigation Menus</h1>
        <Link
          to="/menus/new"
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition duration-200"
        >
          Add New Menu
        </Link>
      </div>

      {menus.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No menus found. Create your first menu!</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items Count
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menus.map((menu) => (
                <tr key={menu._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{menu.location || 'Not set'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{menu.items?.length || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/menus/${menu._id}`}
                      className="text-primary-500 hover:text-primary-700 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(menu)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete the menu "{menuToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menus;