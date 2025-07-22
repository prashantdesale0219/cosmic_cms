import { Menu } from '../models/index.js';

/**
 * @desc    Get navigation menu by location
 * @route   GET /api/navigation/location/:location
 * @access  Public
 */
export const getNavigationByLocation = async (req, res) => {
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

    // Find active menus for the specified location
    const menus = await Menu.find({ location, isActive: true });

    if (!menus || menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No active menus found for location: ${location}`
      });
    }

    // Format the navigation data for frontend consumption
    const navigation = {
      location,
      items: []
    };

    // Process the first menu found (typically there's one menu per location)
    const menu = menus[0];
    
    // Map menu items to navigation items
    navigation.items = menu.items
      .filter(item => item.isActive !== false) // Only include active items
      .sort((a, b) => a.order - b.order) // Sort by order
      .map(item => ({
        label: item.title,
        url: item.path, // Use path as url for frontend
        target: item.target,
        isActive: item.isActive,
        // Include submenu if this item has children
        submenu: menu.items
          .filter(subItem => 
            subItem.parent && 
            subItem.parent.toString() === item._id.toString() && 
            subItem.isActive !== false
          )
          .sort((a, b) => a.order - b.order)
          .map(subItem => ({
            label: subItem.title,
            url: subItem.path, // Use path as url for frontend
            target: subItem.target,
            isActive: subItem.isActive
          }))
      }));

    res.status(200).json({
      success: true,
      navigation
    });
  } catch (error) {
    console.error('Navigation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching navigation data'
    });
  }
};