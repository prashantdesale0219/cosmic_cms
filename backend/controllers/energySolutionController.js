import { EnergySolution } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';
import slugify from 'slugify';

// @desc    Create a new energy solution
// @route   POST /api/energy-solutions
// @access  Private/Admin
export const createEnergySolution = async (req, res) => {
  try {
    const { title, icon, img, description, order, isActive, isFeatured } = req.body;

    // Check if solution with the same title already exists
    const solutionExists = await EnergySolution.findOne({ title });

    if (solutionExists) {
      return res.status(400).json({
        success: false,
        message: 'A solution with this title already exists'
      });
    }

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Create new energy solution
    const energySolution = await EnergySolution.create({
      title,
      slug,
      icon,
      img,
      description,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false
    });

    res.status(201).json({
      success: true,
      data: energySolution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all energy solutions
// @route   GET /api/energy-solutions
// @access  Public
export const getEnergySolutions = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(EnergySolution.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const energySolutions = await features.query;

    // Get total count for pagination
    const totalSolutions = await EnergySolution.countDocuments(features.query._conditions);

    res.json({
      success: true,
      count: energySolutions.length,
      total: totalSolutions,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalSolutions / features.pagination.limit)
      },
      data: energySolutions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get active energy solutions
// @route   GET /api/energy-solutions/active
// @access  Public
export const getActiveEnergySolutions = async (req, res) => {
  try {
    const energySolutions = await EnergySolution.find({ isActive: true }).sort('order');

    res.json({
      success: true,
      count: energySolutions.length,
      data: energySolutions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get energy solution by ID
// @route   GET /api/energy-solutions/:id
// @access  Public
export const getEnergySolutionById = async (req, res) => {
  try {
    const energySolution = await EnergySolution.findById(req.params.id);

    if (!energySolution) {
      return res.status(404).json({
        success: false,
        message: 'Energy solution not found'
      });
    }

    res.json({
      success: true,
      data: energySolution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update energy solution
// @route   PUT /api/energy-solutions/:id
// @access  Private/Admin
export const updateEnergySolution = async (req, res) => {
  try {
    const energySolution = await EnergySolution.findById(req.params.id);

    if (!energySolution) {
      return res.status(404).json({
        success: false,
        message: 'Energy solution not found'
      });
    }

    // Check if updating title and if it already exists
    if (req.body.title && req.body.title !== energySolution.title) {
      const titleExists = await EnergySolution.findOne({ title: req.body.title });
      if (titleExists) {
        return res.status(400).json({
          success: false,
          message: 'A solution with this title already exists'
        });
      }
      
      // Generate new slug if title is updated
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }

    // Update fields
    const updatedEnergySolution = await EnergySolution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedEnergySolution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete energy solution
// @route   DELETE /api/energy-solutions/:id
// @access  Private/Admin
export const deleteEnergySolution = async (req, res) => {
  try {
    const energySolution = await EnergySolution.findById(req.params.id);

    if (!energySolution) {
      return res.status(404).json({
        success: false,
        message: 'Energy solution not found'
      });
    }

    await energySolution.remove();

    res.json({
      success: true,
      message: 'Energy solution removed'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update energy solution order
// @route   PUT /api/energy-solutions/reorder
// @access  Private/Admin
export const reorderEnergySolutions = async (req, res) => {
  try {
    const { solutions } = req.body;

    if (!solutions || !Array.isArray(solutions)) {
      return res.status(400).json({
        success: false,
        message: 'Solutions array is required'
      });
    }

    // Update order for each solution
    const updatePromises = solutions.map(solution => {
      return EnergySolution.findByIdAndUpdate(
        solution.id,
        { order: solution.order },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    // Get updated solutions
    const updatedSolutions = await EnergySolution.find().sort('order');

    res.json({
      success: true,
      message: 'Solutions reordered successfully',
      data: updatedSolutions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get energy solution by slug
// @route   GET /api/energy-solutions/slug/:slug
// @access  Public
export const getEnergySolutionBySlug = async (req, res) => {
  try {
    const energySolution = await EnergySolution.findOne({ slug: req.params.slug });

    if (!energySolution) {
      return res.status(404).json({
        success: false,
        message: 'Energy solution not found'
      });
    }

    res.json({
      success: true,
      data: energySolution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured energy solutions
// @route   GET /api/energy-solutions/featured
// @access  Public
export const getFeaturedEnergySolutions = async (req, res) => {
  try {
    const energySolutions = await EnergySolution.find({ isActive: true, isFeatured: true }).sort('order');

    res.json({
      success: true,
      count: energySolutions.length,
      data: energySolutions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};