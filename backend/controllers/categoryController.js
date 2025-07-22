import { Category } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

// We'll export all functions at the end of the file

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res) => {
  try {
    // Check if category with same name and type already exists
    const existingCategory = await Category.findOne({
      name: req.body.name,
      type: req.body.type
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: `A category with name '${req.body.name}' and type '${req.body.type}' already exists`
      });
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Export will be at the end of file

/**
 * @desc    Get all categories with filtering, sorting, etc.
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Category.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const categories = await features.query;

    // Get total count for pagination
    const totalCount = await Category.countDocuments(features.query.getFilter());

    res.status(200).json({
      success: true,
      count: categories.length,
      totalCount,
      pagination: features.pagination,
      data: categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get active categories by type
 * @route   GET /api/categories/type/:type
 * @access  Public
 */
export const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    // Validate type
    const validTypes = ['blog', 'product', 'project', 'faq'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category type. Must be one of: ${validTypes.join(', ')}`
      });
    }

    const features = new APIFeatures(Category.find({ type, isActive: true }), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const categories = await features.query;

    // Get total count for pagination
    const totalCount = await Category.countDocuments({ type, isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: categories.length,
      totalCount,
      pagination: features.pagination,
      data: categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get featured categories
 * @route   GET /api/categories/featured
 * @access  Public
 */
export const getFeaturedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ featured: true, isActive: true })
      .sort('order');

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single category by slug
 * @route   GET /api/categories/slug/:slug
 * @access  Public
 */
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res) => {
  try {
    // Check if category with same name and type already exists (excluding current category)
    if (req.body.name && req.body.type) {
      const existingCategory = await Category.findOne({
        name: req.body.name,
        type: req.body.type,
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: `A category with name '${req.body.name}' and type '${req.body.type}' already exists`
        });
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
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
 * @desc    Reorder categories
 * @route   PUT /api/categories/reorder
 * @access  Private/Admin
 */
export const reorderCategories = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required for reordering'
      });
    }

    // Update each category's order
    const updatePromises = items.map((item, index) => {
      return Category.findByIdAndUpdate(
        item.id,
        { order: index },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Categories reordered successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get active categories
 * @route   GET /api/categories/active
 * @access  Public
 */
export const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort('order');

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Export all functions for use in other modules
export default {
  createCategory,
  getCategories,
  getCategoriesByType,
  getFeaturedCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  reorderCategories,
  getActiveCategories
};