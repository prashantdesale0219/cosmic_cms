import { Career } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

/**
 * @desc    Create a new career opportunity
 * @route   POST /api/careers
 * @access  Private/Admin
 */
export const createCareer = async (req, res) => {
  try {
    // Check if career with same title already exists
    const existingCareer = await Career.findOne({ title: req.body.title });

    if (existingCareer) {
      return res.status(400).json({
        success: false,
        message: `A career opportunity with title '${req.body.title}' already exists`
      });
    }

    const career = await Career.create(req.body);

    res.status(201).json({
      success: true,
      data: career
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all career opportunities with filtering, sorting, etc.
 * @route   GET /api/careers
 * @access  Public
 */
export const getCareers = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Career.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const careers = await features.query;

    // Get total count for pagination
    const totalCount = await Career.countDocuments(features.query.getFilter());

    res.status(200).json({
      success: true,
      count: careers.length,
      totalCount,
      pagination: features.pagination,
      data: careers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get active career opportunities
 * @route   GET /api/careers/active
 * @access  Public
 */
export const getActiveCareers = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Career.find({ isActive: true }), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const careers = await features.query;

    // Get total count for pagination
    const totalCount = await Career.countDocuments({ isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: careers.length,
      totalCount,
      pagination: features.pagination,
      data: careers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get featured career opportunities
 * @route   GET /api/careers/featured
 * @access  Public
 */
export const getFeaturedCareers = async (req, res) => {
  try {
    const careers = await Career.find({ featured: true, isActive: true })
      .sort('-publishDate');

    res.status(200).json({
      success: true,
      count: careers.length,
      data: careers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get career opportunities by department
 * @route   GET /api/careers/department/:department
 * @access  Public
 */
export const getCareersByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const features = new APIFeatures(
      Career.find({ department, isActive: true }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const careers = await features.query;

    // Get total count for pagination
    const totalCount = await Career.countDocuments({ department, isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: careers.length,
      totalCount,
      pagination: features.pagination,
      data: careers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get career opportunities by location
 * @route   GET /api/careers/location/:location
 * @access  Public
 */
export const getCareersByLocation = async (req, res) => {
  try {
    const { location } = req.params;

    const features = new APIFeatures(
      Career.find({ location, isActive: true }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const careers = await features.query;

    // Get total count for pagination
    const totalCount = await Career.countDocuments({ location, isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: careers.length,
      totalCount,
      pagination: features.pagination,
      data: careers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get career opportunities by type
 * @route   GET /api/careers/type/:type
 * @access  Public
 */
export const getCareersByType = async (req, res) => {
  try {
    const { type } = req.params;

    const features = new APIFeatures(
      Career.find({ type, isActive: true }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const careers = await features.query;

    // Get total count for pagination
    const totalCount = await Career.countDocuments({ type, isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: careers.length,
      totalCount,
      pagination: features.pagination,
      data: careers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single career opportunity by ID
 * @route   GET /api/careers/:id
 * @access  Public
 */
export const getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career opportunity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: career
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single career opportunity by slug
 * @route   GET /api/careers/slug/:slug
 * @access  Public
 */
export const getCareerBySlug = async (req, res) => {
  try {
    const career = await Career.findOne({ slug: req.params.slug });

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career opportunity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: career
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update a career opportunity
 * @route   PUT /api/careers/:id
 * @access  Private/Admin
 */
export const updateCareer = async (req, res) => {
  try {
    // Check if career with same title already exists (excluding current career)
    if (req.body.title) {
      const existingCareer = await Career.findOne({
        title: req.body.title,
        _id: { $ne: req.params.id }
      });

      if (existingCareer) {
        return res.status(400).json({
          success: false,
          message: `A career opportunity with title '${req.body.title}' already exists`
        });
      }
    }

    const career = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career opportunity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: career
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a career opportunity
 * @route   DELETE /api/careers/:id
 * @access  Private/Admin
 */
export const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career opportunity not found'
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
 * @desc    Search career opportunities
 * @route   GET /api/careers/search
 * @access  Public
 */
export const searchCareers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const features = new APIFeatures(
      Career.find(
        { 
          $text: { $search: q },
          isActive: true 
        },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } }),
      req.query
    )
      .limitFields()
      .paginate();

    const careers = await features.query;

    // Get total count for pagination
    const totalCount = await Career.countDocuments({ 
      $text: { $search: q },
      isActive: true 
    });

    res.status(200).json({
      success: true,
      count: careers.length,
      totalCount,
      pagination: features.pagination,
      data: careers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};