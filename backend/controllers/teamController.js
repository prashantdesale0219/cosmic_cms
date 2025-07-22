import { Team } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';

/**
 * @desc    Create a new team member
 * @route   POST /api/team
 * @access  Private/Admin
 */
export const createTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.create(req.body);

    res.status(201).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all team members with filtering, sorting, etc.
 * @route   GET /api/team
 * @access  Public
 */
export const getTeamMembers = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Team.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const teamMembers = await features.query;

    // Get total count for pagination
    const totalCount = await Team.countDocuments(features.query.getFilter());

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      totalCount,
      pagination: features.pagination,
      data: teamMembers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get active team members
 * @route   GET /api/team/active
 * @access  Public
 */
export const getActiveTeamMembers = async (req, res) => {
  try {
    // Execute query with filtering, sorting, pagination, etc.
    const features = new APIFeatures(Team.find({ isActive: true }), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const teamMembers = await features.query;

    // Get total count for pagination
    const totalCount = await Team.countDocuments({ isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      totalCount,
      pagination: features.pagination,
      data: teamMembers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get featured team members
 * @route   GET /api/team/featured
 * @access  Public
 */
export const getFeaturedTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.find({ featured: true, isActive: true })
      .sort('order');

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get team members by department
 * @route   GET /api/team/department/:department
 * @access  Public
 */
export const getTeamMembersByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const features = new APIFeatures(
      Team.find({ department, isActive: true }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const teamMembers = await features.query;

    // Get total count for pagination
    const totalCount = await Team.countDocuments({ department, isActive: true, ...features.query.getFilter() });

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      totalCount,
      pagination: features.pagination,
      data: teamMembers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single team member by ID
 * @route   GET /api/team/:id
 * @access  Public
 */
export const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update a team member
 * @route   PUT /api/team/:id
 * @access  Private/Admin
 */
export const updateTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a team member
 * @route   DELETE /api/team/:id
 * @access  Private/Admin
 */
export const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
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
 * @desc    Reorder team members
 * @route   PUT /api/team/reorder
 * @access  Private/Admin
 */
export const reorderTeamMembers = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required for reordering'
      });
    }

    // Update each team member's order
    const updatePromises = items.map((item, index) => {
      return Team.findByIdAndUpdate(
        item.id,
        { order: index },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Team members reordered successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};