import { SolarSolution } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

/**
 * @desc    Create a new solar solution
 * @route   POST /api/solar-solutions
 * @access  Private/Admin
 */
export const createSolarSolution = async (req, res) => {
  try {
    console.log('Creating solar solution with data:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'image', 'category'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if solution with same title already exists
    const existingSolution = await SolarSolution.findOne({ title: req.body.title });

    if (existingSolution) {
      console.log(`Solar solution with title '${req.body.title}' already exists`);
      return res.status(400).json({
        success: false,
        message: `A solar solution with title '${req.body.title}' already exists`
      });
    }
    
    // Generate slug if not provided
    if (!req.body.slug) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }
    
    // Check if solution with same slug already exists
    const existingSlug = await SolarSolution.findOne({ slug: req.body.slug });
    
    if (existingSlug) {
      console.log(`Solar solution with slug '${req.body.slug}' already exists`);
      return res.status(400).json({
        success: false,
        message: `A solar solution with slug '${req.body.slug}' already exists`
      });
    }

    // Log the final data being sent to the database
    console.log('Final solar solution data being saved:', JSON.stringify(req.body, null, 2));

    // Create the solar solution
    const solarSolution = await SolarSolution.create(req.body);
    console.log('Solar solution created successfully:', solarSolution._id);

    res.status(201).json({
      success: true,
      data: solarSolution
    });
  } catch (error) {
    console.error('Error creating solar solution:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Solar solution with this ${field} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while creating the solar solution'
    });
  }
};

/**
 * @desc    Get all solar solutions with filtering, sorting, etc.
 * @route   GET /api/solar-solutions
 * @access  Public
 */
export const getSolarSolutions = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(SolarSolution.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const solarSolutions = await features.query;

    // Get total count for pagination
    const totalCount = await SolarSolution.countDocuments(features.query.getFilter());

    res.status(200).json({
      success: true,
      count: solarSolutions.length,
      totalCount,
      pagination: features.pagination,
      data: solarSolutions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get active solar solutions
 * @route   GET /api/solar-solutions/active
 * @access  Public
 */
export const getActiveSolarSolutions = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(SolarSolution.find({ isActive: true }), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const solarSolutions = await features.query;

    // Get total count for pagination
    const totalCount = await SolarSolution.countDocuments({ isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: solarSolutions.length,
      totalCount,
      pagination: features.pagination,
      data: solarSolutions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get featured solar solutions
 * @route   GET /api/solar-solutions/featured
 * @access  Public
 */
export const getFeaturedSolarSolutions = async (req, res) => {
  try {
    const solarSolutions = await SolarSolution.find({ featured: true, isActive: true })
      .sort('order');

    res.status(200).json({
      success: true,
      count: solarSolutions.length,
      data: solarSolutions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get solar solutions by category
 * @route   GET /api/solar-solutions/category/:category
 * @access  Public
 */
export const getSolarSolutionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const features = new APIFeatures(
      SolarSolution.find({ category, isActive: true }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const solarSolutions = await features.query;

    // Get total count for pagination
    const totalCount = await SolarSolution.countDocuments({ category, isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: solarSolutions.length,
      totalCount,
      pagination: features.pagination,
      data: solarSolutions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single solar solution by ID
 * @route   GET /api/solar-solutions/:id
 * @access  Public
 */
export const getSolarSolutionById = async (req, res) => {
  try {
    const solarSolution = await SolarSolution.findById(req.params.id);

    if (!solarSolution) {
      return res.status(404).json({
        success: false,
        message: 'Solar solution not found'
      });
    }

    res.status(200).json({
      success: true,
      data: solarSolution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single solar solution by slug
 * @route   GET /api/solar-solutions/slug/:slug
 * @access  Public
 */
export const getSolarSolutionBySlug = async (req, res) => {
  try {
    const solarSolution = await SolarSolution.findOne({ slug: req.params.slug });

    if (!solarSolution) {
      return res.status(404).json({
        success: false,
        message: 'Solar solution not found'
      });
    }

    res.status(200).json({
      success: true,
      data: solarSolution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update a solar solution
 * @route   PUT /api/solar-solutions/:id
 * @access  Private/Admin
 */
export const updateSolarSolution = async (req, res) => {
  try {
    console.log(`Updating solar solution with ID: ${req.params.id}`);
    console.log('Update data:', JSON.stringify(req.body, null, 2));

    // Check if solution exists
    const existingSolution = await SolarSolution.findById(req.params.id);

    if (!existingSolution) {
      return res.status(404).json({
        success: false,
        message: 'Solar solution not found'
      });
    }

    // If title is being updated, check for duplicates
    if (req.body.title && req.body.title !== existingSolution.title) {
      const duplicateTitle = await SolarSolution.findOne({
        title: req.body.title,
        _id: { $ne: req.params.id }
      });

      if (duplicateTitle) {
        return res.status(400).json({
          success: false,
          message: `A solar solution with title '${req.body.title}' already exists`
        });
      }
    }

    // If slug is being updated, check for duplicates
    if (req.body.slug && req.body.slug !== existingSolution.slug) {
      const duplicateSlug = await SolarSolution.findOne({
        slug: req.body.slug,
        _id: { $ne: req.params.id }
      });

      if (duplicateSlug) {
        return res.status(400).json({
          success: false,
          message: `A solar solution with slug '${req.body.slug}' already exists`
        });
      }
    }

    // Update the solar solution
    const solarSolution = await SolarSolution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    console.log('Solar solution updated successfully');

    res.status(200).json({
      success: true,
      data: solarSolution
    });
  } catch (error) {
    console.error('Error updating solar solution:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Solar solution with this ${field} already exists`
      });
    }

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a solar solution
 * @route   DELETE /api/solar-solutions/:id
 * @access  Private/Admin
 */
export const deleteSolarSolution = async (req, res) => {
  try {
    console.log(`Deleting solar solution with ID: ${req.params.id}`);

    const solarSolution = await SolarSolution.findById(req.params.id);

    if (!solarSolution) {
      return res.status(404).json({
        success: false,
        message: 'Solar solution not found'
      });
    }

    await SolarSolution.findByIdAndDelete(req.params.id);

    console.log('Solar solution deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Solar solution deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting solar solution:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update solar solution order
 * @route   PUT /api/solar-solutions/reorder
 * @access  Private/Admin
 */
export const updateSolarSolutionOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request format. Expected an array of items.'
      });
    }

    // Update each item's order
    const updatePromises = items.map(item => {
      return SolarSolution.findByIdAndUpdate(
        item.id,
        { order: item.order },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Solar solution order updated successfully'
    });
  } catch (error) {
    console.error('Error updating solar solution order:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};