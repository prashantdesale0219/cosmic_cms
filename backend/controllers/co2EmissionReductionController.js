import { CO2EmissionReduction } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

// @desc    Create a new CO2 emission reduction entry
// @route   POST /api/co2-emission-reduction
// @access  Private/Admin
export const createCO2EmissionReduction = async (req, res) => {
  try {
    const { title, description, icon, image, value, unit, timeframe, methodology, order, isActive } = req.body;

    // Create new CO2 emission reduction entry
    const co2EmissionReduction = await CO2EmissionReduction.create({
      title,
      description,
      icon,
      image,
      value,
      unit,
      timeframe,
      methodology,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      data: co2EmissionReduction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all CO2 emission reduction entries
// @route   GET /api/co2-emission-reduction
// @access  Public
export const getCO2EmissionReductions = async (req, res) => {
  try {
    // Initialize API features
    const features = new APIFeatures(CO2EmissionReduction.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const co2EmissionReductions = await features.query;

    // Get total count for pagination
    const totalEntries = await CO2EmissionReduction.countDocuments(features.query._conditions);

    res.json({
      success: true,
      count: co2EmissionReductions.length,
      total: totalEntries,
      pagination: {
        page: features.pagination.page,
        limit: features.pagination.limit,
        totalPages: Math.ceil(totalEntries / features.pagination.limit)
      },
      data: co2EmissionReductions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get active CO2 emission reduction entries
// @route   GET /api/co2-emission-reduction/active
// @access  Public
export const getActiveCO2EmissionReductions = async (req, res) => {
  try {
    const co2EmissionReductions = await CO2EmissionReduction.find({ isActive: true }).sort('order');

    res.json({
      success: true,
      count: co2EmissionReductions.length,
      data: co2EmissionReductions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get CO2 emission reduction entry by ID
// @route   GET /api/co2-emission-reduction/:id
// @access  Public
export const getCO2EmissionReductionById = async (req, res) => {
  try {
    const co2EmissionReduction = await CO2EmissionReduction.findById(req.params.id);

    if (!co2EmissionReduction) {
      return res.status(404).json({
        success: false,
        message: 'CO2 emission reduction entry not found'
      });
    }

    res.json({
      success: true,
      data: co2EmissionReduction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update CO2 emission reduction entry
// @route   PUT /api/co2-emission-reduction/:id
// @access  Private/Admin
export const updateCO2EmissionReduction = async (req, res) => {
  try {
    const co2EmissionReduction = await CO2EmissionReduction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!co2EmissionReduction) {
      return res.status(404).json({
        success: false,
        message: 'CO2 emission reduction entry not found'
      });
    }

    res.json({
      success: true,
      data: co2EmissionReduction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete CO2 emission reduction entry
// @route   DELETE /api/co2-emission-reduction/:id
// @access  Private/Admin
export const deleteCO2EmissionReduction = async (req, res) => {
  try {
    const co2EmissionReduction = await CO2EmissionReduction.findByIdAndDelete(req.params.id);

    if (!co2EmissionReduction) {
      return res.status(404).json({
        success: false,
        message: 'CO2 emission reduction entry not found'
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

// @desc    Reorder CO2 emission reduction entries
// @route   PUT /api/co2-emission-reduction/reorder
// @access  Private/Admin
export const reorderCO2EmissionReductions = async (req, res) => {
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
      return CO2EmissionReduction.findByIdAndUpdate(
        item.id,
        { order: item.order },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    // Get updated items
    const updatedItems = await CO2EmissionReduction.find().sort('order');

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