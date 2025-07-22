import { Menu } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

// Import the getNavigationByLocation function from navigationController
import { getNavigationByLocation as getNavigation } from './navigationController.js';

/**
 * @desc    Create a new menu
 * @route   POST /api/menus
 * @access  Private/Admin
 */
export const createMenu = async (req, res) => {
  try {
    // Check if menu with same name already exists
    const existingMenu = await Menu.findOne({ name: req.body.name });

    if (existingMenu) {
      return res.status(400).json({
        success: false,
        message: `A menu with name '${req.body.name}' already exists`
      });
    }

    // Process menu items to map 'url' to 'path' if needed
    if (req.body.items && Array.isArray(req.body.items)) {
      req.body.items = req.body.items.map(item => {
        // If item has url but no path, use url as path
        if (item.url && !item.path) {
          item.path = item.url;
          // Keep url for backward compatibility
        }
        return item;
      });
    }

    const menu = await Menu.create(req.body);

    res.status(201).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all menus with filtering, sorting, etc.
 * @route   GET /api/menus
 * @access  Private/Admin
 */
export const getMenus = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Menu.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const menus = await features.query;

    // Get total count for pagination
    const totalCount = await Menu.countDocuments(features.query.getFilter());

    res.status(200).json({
      success: true,
      count: menus.length,
      totalCount,
      pagination: features.pagination,
      data: menus
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get active menus by location
 * @route   GET /api/menus/location/:location
 * @access  Public
 */
export const getMenusByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    
    // Validate location
    const validLocations = ['header', 'footer', 'sidebar', 'mobile', 'other'];
    if (!validLocations.includes(location)) {
      return res.status(400).json({
        success: false,
        message: `Invalid menu location. Must be one of: ${validLocations.join(', ')}`
      });
    }

    const menus = await Menu.find({ location, isActive: true });

    // Also call the navigation controller to get formatted navigation data
    // This is a workaround to support both the old and new API endpoints
    if (req.query.includeNavigation === 'true') {
      // Forward the request to the navigation controller
      return getNavigation(req, res);
    }

    // If navigation data is not requested, return the menus as before
    res.status(200).json({
      success: true,
      count: menus.length,
      data: menus,
      // Include a hint about the navigation endpoint
      message: "For formatted navigation data, use /api/navigation/location/:location or add ?includeNavigation=true to this request"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single menu by ID
 * @route   GET /api/menus/:id
 * @access  Private/Admin
 */
export const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single menu by slug
 * @route   GET /api/menus/slug/:slug
 * @access  Public
 */
export const getMenuBySlug = async (req, res) => {
  try {
    const menu = await Menu.findOne({ slug: req.params.slug, isActive: true });

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update a menu
 * @route   PUT /api/menus/:id
 * @access  Private/Admin
 */
export const updateMenu = async (req, res) => {
  try {
    // Check if menu with same name already exists (excluding current menu)
    if (req.body.name) {
      const existingMenu = await Menu.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id }
      });

      if (existingMenu) {
        return res.status(400).json({
          success: false,
          message: `A menu with name '${req.body.name}' already exists`
        });
      }
    }

    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a menu
 * @route   DELETE /api/menus/:id
 * @access  Private/Admin
 */
export const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Add a menu item
 * @route   POST /api/menus/:id/items
 * @access  Private/Admin
 */
export const addMenuItem = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    // Process the item to map 'url' to 'path' if needed
    const menuItem = { ...req.body };
    if (menuItem.url && !menuItem.path) {
      menuItem.path = menuItem.url;
      // Keep url for backward compatibility
    }

    // Add the new item to the menu
    menu.items.push(menuItem);
    await menu.save();

    res.status(201).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update a menu item
 * @route   PUT /api/menus/:id/items/:itemId
 * @access  Private/Admin
 */
export const updateMenuItem = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    // Find the item index
    const itemIndex = menu.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Process the update data to map 'url' to 'path' if needed
    const updateData = { ...req.body };
    if (updateData.url && !updateData.path) {
      updateData.path = updateData.url;
      // Keep url for backward compatibility
    }

    // Update the item
    menu.items[itemIndex] = { ...menu.items[itemIndex].toObject(), ...updateData };
    await menu.save();

    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a menu item
 * @route   DELETE /api/menus/:id/items/:itemId
 * @access  Private/Admin
 */
export const deleteMenuItem = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    // Find the item index
    const itemIndex = menu.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Remove the item
    menu.items.splice(itemIndex, 1);
    await menu.save();

    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Reorder menu items
 * @route   PUT /api/menus/:id/reorder
 * @access  Private/Admin
 */
export const reorderMenuItems = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required for reordering'
      });
    }

    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    // Update each item's order
    items.forEach((item, index) => {
      const menuItem = menu.items.id(item.id);
      if (menuItem) {
        menuItem.order = index;
      }
    });

    await menu.save();

    res.status(200).json({
      success: true,
      message: 'Menu items reordered successfully',
      data: menu
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};