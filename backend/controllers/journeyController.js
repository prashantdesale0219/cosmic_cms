import { Journey } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

// @desc    Create a new journey milestone
// @route   POST /api/journey
// @access  Private/Admin
export const createJourneyMilestone = async (req, res) => {
  try {
    const { year, title, description, icon, image, order, isActive } = req.body;

    // Create new journey milestone
    const journeyMilestone = await Journey.create({
      year,
      title,
      description,
      icon,
      image,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      data: journeyMilestone
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all journey milestones
// @route   GET /api/journey
// @access  Public
export const getJourneyMilestones = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(Journey.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const journeyMilestones = await features.query;

    // Get total count for pagination
    const totalMilestones = await Journey.countDocuments(features.query._conditions);

    res.json({
      success: true,
      count: journeyMilestones.length,
      total: totalMilestones,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalMilestones / features.pagination.limit)
      },
      data: journeyMilestones
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get active journey milestones
// @route   GET /api/journey/active
// @access  Public
export const getActiveJourneyMilestones = async (req, res) => {
  try {
    const journeyMilestones = await Journey.find({ isActive: true }).sort('order');

    res.json({
      success: true,
      count: journeyMilestones.length,
      data: journeyMilestones
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get journey milestone by ID
// @route   GET /api/journey/:id
// @access  Public
export const getJourneyMilestoneById = async (req, res) => {
  try {
    const journeyMilestone = await Journey.findById(req.params.id);

    if (!journeyMilestone) {
      return res.status(404).json({
        success: false,
        message: 'Journey milestone not found'
      });
    }

    res.json({
      success: true,
      data: journeyMilestone
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update journey milestone
// @route   PUT /api/journey/:id
// @access  Private/Admin
export const updateJourneyMilestone = async (req, res) => {
  try {
    const journeyMilestone = await Journey.findById(req.params.id);

    if (!journeyMilestone) {
      return res.status(404).json({
        success: false,
        message: 'Journey milestone not found'
      });
    }

    // Update fields
    const updatedJourneyMilestone = await Journey.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedJourneyMilestone
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete journey milestone
// @route   DELETE /api/journey/:id
// @access  Private/Admin
export const deleteJourneyMilestone = async (req, res) => {
  try {
    const journeyMilestone = await Journey.findById(req.params.id);

    if (!journeyMilestone) {
      return res.status(404).json({
        success: false,
        message: 'Journey milestone not found'
      });
    }

    await Journey.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Journey milestone removed'
    });
  } catch (error) {
    console.error('Error deleting journey milestone:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reorder journey milestones
// @route   PUT /api/journey/reorder
// @access  Private/Admin
export const reorderJourneyMilestones = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    // Update each item's order
    const updatePromises = items.map((item) => {
      return Journey.findByIdAndUpdate(
        item.id,
        { order: item.order },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Journey milestones reordered successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};