import { Testimonial } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

/**
 * @desc    Create a new testimonial
 * @route   POST /api/testimonials
 * @access  Private/Admin
 */
export const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);

    res.status(201).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all testimonials with filtering, sorting, etc.
 * @route   GET /api/testimonials
 * @access  Private/Admin
 */
export const getTestimonials = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Testimonial.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const testimonials = await features.query;

    // Get total count for pagination
    const totalCount = await Testimonial.countDocuments(features.query.getFilter());

    res.status(200).json({
      success: true,
      count: testimonials.length,
      totalCount,
      pagination: features.pagination,
      data: testimonials
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get active testimonials
 * @route   GET /api/testimonials/active
 * @access  Public
 */
export const getActiveTestimonials = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Testimonial.find({ isActive: true }), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const testimonials = await features.query;

    // Get total count for pagination
    const totalCount = await Testimonial.countDocuments({ isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      totalCount,
      pagination: features.pagination,
      data: testimonials
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get featured testimonials
 * @route   GET /api/testimonials/featured
 * @access  Public
 */
export const getFeaturedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ featured: true, isActive: true })
      .sort('order');

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get testimonials by project type
 * @route   GET /api/testimonials/project-type/:projectType
 * @access  Public
 */
export const getTestimonialsByProjectType = async (req, res) => {
  try {
    const { projectType } = req.params;

    const features = new APIFeatures(
      Testimonial.find({ projectType, isActive: true }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const testimonials = await features.query;

    // Get total count for pagination
    const totalCount = await Testimonial.countDocuments({ projectType, isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      totalCount,
      pagination: features.pagination,
      data: testimonials
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single testimonial by ID
 * @route   GET /api/testimonials/:id
 * @access  Public
 */
export const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update a testimonial
 * @route   PUT /api/testimonials/:id
 * @access  Private/Admin
 */
export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a testimonial
 * @route   DELETE /api/testimonials/:id
 * @access  Private/Admin
 */
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
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
 * @desc    Reorder testimonials
 * @route   PUT /api/testimonials/reorder
 * @access  Private/Admin
 */
export const reorderTestimonials = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required for reordering'
      });
    }

    // Update each testimonial's order
    const updatePromises = items.map((item, index) => {
      return Testimonial.findByIdAndUpdate(
        item.id,
        { order: index },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Testimonials reordered successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};