import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { menuService } from '../../services/api';
import { toast } from 'react-hot-toast';

const MenuForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm();

  const isEditMode = Boolean(id);

  // Fetch menu data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchMenu(id);
    }
  }, [id]);

  const fetchMenu = async (menuId) => {
    try {
      setIsLoading(true);
      const response = await menuService.getMenuById(menuId);
      
      if (response.success) {
        const menu = response.data;
        setValue('name', menu.name);
        setValue('location', menu.location);
        setMenuItems(menu.items || []);
      } else {
        toast.error('Failed to fetch menu details');
        navigate('/menus');
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('An error occurred while fetching menu details');
      navigate('/menus');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Add menu items to the data
      data.items = menuItems;
      
      let response;
      if (isEditMode) {
        response = await menuService.updateMenu(id, data);
      } else {
        response = await menuService.createMenu(data);
      }
      
      if (response.success) {
        toast.success(isEditMode ? 'Menu updated successfully' : 'Menu created successfully');
        navigate('/menus');
      } else {
        toast.error(response.message || (isEditMode ? 'Failed to update menu' : 'Failed to create menu'));
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      toast.error('An error occurred while saving the menu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMenuItem = () => {
    setMenuItems([...menuItems, { label: '', url: '', order: menuItems.length }]);
  };

  const handleRemoveMenuItem = (index) => {
    const updatedItems = [...menuItems];
    updatedItems.splice(index, 1);
    // Update order for remaining items
    const reorderedItems = updatedItems.map((item, idx) => ({
      ...item,
      order: idx
    }));
    setMenuItems(reorderedItems);
  };

  const handleMenuItemChange = (index, field, value) => {
    const updatedItems = [...menuItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setMenuItems(updatedItems);
  };

  const handleMoveItem = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === menuItems.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedItems = [...menuItems];
    [updatedItems[index], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[index]];
    
    // Update order for all items
    const reorderedItems = updatedItems.map((item, idx) => ({
      ...item,
      order: idx
    }));
    
    setMenuItems(reorderedItems);
  };

  const handleCancel = () => {
    navigate('/menus');
  };

  if (isLoading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {isEditMode ? 'Edit Menu' : 'Create New Menu'}
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Menu Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Menu Name *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Menu name is required' })}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500`}
                placeholder="Main Menu"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Menu Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Menu Location
              </label>
              <input
                type="text"
                {...register('location')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="header, footer, sidebar"
              />
            </div>
          </div>

          {/* Menu Items */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium text-gray-800">Menu Items</h2>
              <button
                type="button"
                onClick={handleAddMenuItem}
                className="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition duration-200 text-sm"
              >
                Add Item
              </button>
            </div>

            {menuItems.length === 0 ? (
              <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-md">
                No menu items added yet. Click "Add Item" to create your first menu item.
              </div>
            ) : (
              <div className="space-y-4">
                {menuItems.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 flex-grow">
                      <div className="w-full md:w-5/12">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                        <input
                          type="text"
                          value={item.label || ''}
                          onChange={(e) => handleMenuItemChange(index, 'label', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="Home"
                        />
                      </div>
                      <div className="w-full md:w-5/12">
                        <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                        <input
                          type="text"
                          value={item.url || ''}
                          onChange={(e) => handleMenuItemChange(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="/home"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 md:mt-0">
                      <button
                        type="button"
                        onClick={() => handleMoveItem(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded ${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveItem(index, 'down')}
                        disabled={index === menuItems.length - 1}
                        className={`p-1 rounded ${index === menuItems.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveMenuItem(index)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <span>{isEditMode ? 'Update Menu' : 'Create Menu'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuForm;