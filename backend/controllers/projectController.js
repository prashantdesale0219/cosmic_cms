import { Project } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private/Admin
 */
export const createProject = async (req, res) => {
  try {
    console.log('Creating project with data:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'description', 'client', 'location', 'completionDate', 'coverImage'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    // Special handling for category field
    if (!req.body.category) {
      console.log('Category field is missing, setting default value: residential');
      req.body.category = 'residential';
    }
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if project with same title already exists
    const existingProject = await Project.findOne({ title: req.body.title });

    if (existingProject) {
      console.log(`Project with title '${req.body.title}' already exists`);
      return res.status(400).json({
        success: false,
        message: `A project with title '${req.body.title}' already exists`
      });
    }
    
    // Check if project with same slug already exists
    const existingSlug = await Project.findOne({ slug: req.body.slug });
    
    if (existingSlug) {
      console.log(`Project with slug '${req.body.slug}' already exists`);
      return res.status(400).json({
        success: false,
        message: `A project with slug '${req.body.slug}' already exists`
      });
    }

    // Log the final data being sent to the database
    console.log('Final project data being saved:', JSON.stringify(req.body, null, 2));

    // Create the project
    const project = await Project.create(req.body);
    console.log('Project created successfully:', project._id);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    
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
        message: `Project with this ${field} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while creating the project'
    });
  }
};

/**
 * @desc    Get all projects with filtering, sorting, etc.
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Project.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const projects = await features.query;

    // Get total count for pagination
    const totalCount = await Project.countDocuments(features.query.getFilter());

    res.status(200).json({
      success: true,
      count: projects.length,
      totalCount,
      pagination: features.pagination,
      data: projects
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get active projects
 * @route   GET /api/projects/active
 * @access  Public
 */
export const getActiveProjects = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Project.find({ isActive: true }), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const projects = await features.query;

    // Get total count for pagination
    const totalCount = await Project.countDocuments({ isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: projects.length,
      totalCount,
      pagination: features.pagination,
      data: projects
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get featured projects
 * @route   GET /api/projects/featured
 * @access  Public
 */
export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true, isActive: true })
      .sort('order');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get projects by category
 * @route   GET /api/projects/category/:category
 * @access  Public
 */
export const getProjectsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const features = new APIFeatures(
      Project.find({ category, isActive: true }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const projects = await features.query;

    // Get total count for pagination
    const totalCount = await Project.countDocuments({ category, isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: projects.length,
      totalCount,
      pagination: features.pagination,
      data: projects
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single project by slug
 * @route   GET /api/projects/slug/:slug
 * @access  Public
 */
export const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private/Admin
 */
export const updateProject = async (req, res) => {
  try {
    // Check if project with same title already exists (excluding current project)
    if (req.body.title) {
      const existingProject = await Project.findOne({
        title: req.body.title,
        _id: { $ne: req.params.id }
      });

      if (existingProject) {
        return res.status(400).json({
          success: false,
          message: `A project with title '${req.body.title}' already exists`
        });
      }
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private/Admin
 */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
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
 * @desc    Reorder projects
 * @route   PUT /api/projects/reorder
 * @access  Private/Admin
 */
export const reorderProjects = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required for reordering'
      });
    }

    // Update each project's order
    const updatePromises = items.map((item, index) => {
      return Project.findByIdAndUpdate(
        item.id,
        { order: index },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Projects reordered successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Search projects
 * @route   GET /api/projects/search
 * @access  Public
 */
export const searchProjects = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const features = new APIFeatures(
      Project.find(
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

    const projects = await features.query;

    // Get total count for pagination
    const totalCount = await Project.countDocuments({ 
      $text: { $search: q },
      isActive: true 
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      totalCount,
      pagination: features.pagination,
      data: projects
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};