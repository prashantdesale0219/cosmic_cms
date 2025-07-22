import { IntelligentSolution } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

// @desc    Create a new intelligent solution
// @route   POST /api/intelligent-solution
// @access  Private/Admin
export const createIntelligentSolution = async (req, res) => {
  try {
    const { title, description, icon, image, features, benefits, technologyUsed, order, isActive } = req.body;

    // Create new intelligent solution
    const intelligentSolution = await IntelligentSolution.create({
      title,
      description,
      icon,
      image,
      features,
      benefits,
      technologyUsed,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      data: intelligentSolution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all intelligent solutions
// @route   GET /api/intelligent-solution
// @access  Public
export const getIntelligentSolutions = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(IntelligentSolution.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const intelligentSolutions = await features.query;

    // Get total count for pagination
    const totalSolutions = await IntelligentSolution.countDocuments(features.query._conditions);

    res.json({
      success: true,
      count: intelligentSolutions.length,
      total: totalSolutions,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalSolutions / features.pagination.limit)
      },
      data: intelligentSolutions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get active intelligent solutions
// @route   GET /api/intelligent-solution/active
// @access  Public
export const getActiveIntelligentSolutions = async (req, res) => {
  try {
    const intelligentSolutions = await IntelligentSolution.find({ isActive: true }).sort('order');

    res.json({
      success: true,
      count: intelligentSolutions.length,
      data: intelligentSolutions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get intelligent solution by ID
// @route   GET /api/intelligent-solution/:id
// @access  Public
export const getIntelligentSolutionById = async (req, res) => {
  try {
    const intelligentSolution = await IntelligentSolution.findById(req.params.id);

    if (!intelligentSolution) {
      return res.status(404).json({
        success: false,
        message: 'Intelligent solution not found'
      });
    }

    res.json({
      success: true,
      data: intelligentSolution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update intelligent solution
// @route   PUT /api/intelligent-solution/:id
// @access  Private/Admin
export const updateIntelligentSolution = async (req, res) => {
  try {
    const intelligentSolution = await IntelligentSolution.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!intelligentSolution) {
      return res.status(404).json({
        success: false,
        message: 'Intelligent solution not found'
      });
    }

    res.json({
      success: true,
      data: intelligentSolution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete intelligent solution
// @route   DELETE /api/intelligent-solution/:id
// @access  Private/Admin
export const deleteIntelligentSolution = async (req, res) => {
  try {
    const intelligentSolution = await IntelligentSolution.findByIdAndDelete(req.params.id);

    if (!intelligentSolution) {
      return res.status(404).json({
        success: false,
        message: 'Intelligent solution not found'
      });
    }

    res.json({
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

// @desc    Reorder intelligent solutions
// @route   PUT /api/intelligent-solution/reorder
// @access  Private/Admin
export const reorderIntelligentSolutions = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    // Update each item's order
    const updatePromises = items.map(item => {
      return IntelligentSolution.findByIdAndUpdate(
        item.id,
        { order: item.order },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    // Get updated items
    const updatedItems = await IntelligentSolution.find().sort('order');

    res.json({
      success: true,
      data: updatedItems
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};