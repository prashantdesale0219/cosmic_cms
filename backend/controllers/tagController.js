import { Tag } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

// We'll export all functions at the end of the file

/**
 * @desc    Create a new tag
 * @route   POST /api/tags
 * @access  Private/Admin
 */
export const createTag = async (req, res) => {
  try {
    // Check if tag with same name and type already exists
    const existingTag = await Tag.findOne({
      name: req.body.name,
      type: req.body.type
    });

    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: `A tag with name '${req.body.name}' and type '${req.body.type}' already exists`
      });
    }

    const tag = await Tag.create(req.body);

    res.status(201).json({
      success: true,
      data: tag
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all tags with filtering, sorting, etc.
 * @route   GET /api/tags
 * @access  Public
 */
export const getTags = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Tag.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const tags = await features.query;

    // Get total count for pagination
    const totalCount = await Tag.countDocuments(features.query.getFilter());

    res.status(200).json({
      success: true,
      count: tags.length,
      totalCount,
      pagination: features.pagination,
      data: tags
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get active tags by type
 * @route   GET /api/tags/type/:type
 * @access  Public
 */
export const getTagsByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    // Validate type
    const validTypes = ['blog', 'product', 'project', 'media'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid tag type. Must be one of: ${validTypes.join(', ')}`
      });
    }

    const features = new APIFeatures(Tag.find({ type, isActive: true }), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const tags = await features.query;

    // Get total count for pagination
    const totalCount = await Tag.countDocuments({ type, isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: tags.length,
      totalCount,
      pagination: features.pagination,
      data: tags
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single tag by ID
 * @route   GET /api/tags/:id
 * @access  Public
 */
export const getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single tag by slug
 * @route   GET /api/tags/slug/:slug
 * @access  Public
 */
export const getTagBySlug = async (req, res) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update a tag
 * @route   PUT /api/tags/:id
 * @access  Private/Admin
 */
export const updateTag = async (req, res) => {
  try {
    // Check if tag with same name and type already exists (excluding current tag)
    if (req.body.name && req.body.type) {
      const existingTag = await Tag.findOne({
        name: req.body.name,
        type: req.body.type,
        _id: { $ne: req.params.id }
      });

      if (existingTag) {
        return res.status(400).json({
          success: false,
          message: `A tag with name '${req.body.name}' and type '${req.body.type}' already exists`
        });
      }
    }

    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a tag
 * @route   DELETE /api/tags/:id
 * @access  Private/Admin
 */
export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
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
 * @desc    Increment tag count
 * @route   PUT /api/tags/:id/increment
 * @access  Private
 */
export const incrementTagCount = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { $inc: { count: 1 } },
      { new: true }
    );

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Decrement tag count
 * @route   PUT /api/tags/:id/decrement
 * @access  Private
 */
export const decrementTagCount = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }
    
    // Ensure count doesn't go below 0
    if (tag.count > 0) {
      tag.count -= 1;
      await tag.save();
    }

    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get active tags
 * @route   GET /api/tags/active
 * @access  Public
 */
export const getActiveTags = async (req, res) => {
  try {
    const tags = await Tag.find({ isActive: true })
      .sort('order');

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Updated on: June 30, 2025

// Export all functions for use in other modules
export default {
  createTag,
  getTags,
  getTagsByType,
  getTagById,
  getTagBySlug,
  updateTag,
  deleteTag,
  incrementTagCount,
  decrementTagCount,
  getActiveTags
};