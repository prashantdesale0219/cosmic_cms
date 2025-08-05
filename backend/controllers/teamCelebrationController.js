import asyncHandler from 'express-async-handler';
import {
  TeamCelebrationHero,
  TeamCulture,
  CelebrationEvent,
  TeamAchievement,
  TeamCelebrationCTA
} from '../models/index.js';

// @desc    Create team celebration hero
// @route   POST /api/team-celebration/hero
// @access  Private
export const createTeamCelebrationHero = asyncHandler(async (req, res) => {
  const hero = await TeamCelebrationHero.create(req.body);

  res.status(201).json({
    success: true,
    data: hero
  });
});

// @desc    Get team celebration hero data
// @route   GET /api/team-celebration/hero
// @access  Public
export const getTeamCelebrationHero = asyncHandler(async (req, res) => {
  const hero = await TeamCelebrationHero.findOne({ isActive: true });
  
  if (!hero) {
    return res.status(404).json({
      success: false,
      message: 'Team celebration hero not found'
    });
  }

  res.status(200).json({
    success: true,
    data: hero
  });
});

// @desc    Update team celebration hero
// @route   PUT /api/team-celebration/hero/:id
// @access  Private
export const updateTeamCelebrationHero = asyncHandler(async (req, res) => {
  const hero = await TeamCelebrationHero.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!hero) {
    return res.status(404).json({
      success: false,
      message: 'Team celebration hero not found'
    });
  }

  res.status(200).json({
    success: true,
    data: hero
  });
});

// @desc    Create team culture
// @route   POST /api/team-celebration/culture
// @access  Private
export const createTeamCulture = asyncHandler(async (req, res) => {
  const culture = await TeamCulture.create(req.body);

  res.status(201).json({
    success: true,
    data: culture
  });
});

// @desc    Get team culture data
// @route   GET /api/team-celebration/culture
// @access  Public
export const getTeamCulture = asyncHandler(async (req, res) => {
  const culture = await TeamCulture.findOne({ isActive: true });
  
  if (!culture) {
    return res.status(404).json({
      success: false,
      message: 'Team culture not found'
    });
  }

  res.status(200).json({
    success: true,
    data: culture
  });
});

// @desc    Update team culture
// @route   PUT /api/team-celebration/culture/:id
// @access  Private
export const updateTeamCulture = asyncHandler(async (req, res) => {
  const culture = await TeamCulture.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!culture) {
    return res.status(404).json({
      success: false,
      message: 'Team culture not found'
    });
  }

  res.status(200).json({
    success: true,
    data: culture
  });
});

// @desc    Get all celebration events
// @route   GET /api/team-celebration/events
// @access  Public
export const getCelebrationEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const isActive = req.query.isActive;
  
  // Build query
  let query = {};
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }
  
  const skip = (page - 1) * limit;
  
  const [events, total] = await Promise.all([
    CelebrationEvent.find(query).sort('order').skip(skip).limit(limit),
    CelebrationEvent.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: events.length,
    data: {
      events,
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single celebration event
// @route   GET /api/team-celebration/events/:id
// @access  Public
export const getCelebrationEvent = asyncHandler(async (req, res) => {
  const event = await CelebrationEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Celebration event not found'
    });
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc    Create celebration event
// @route   POST /api/team-celebration/events
// @access  Private
export const createCelebrationEvent = asyncHandler(async (req, res) => {
  const event = await CelebrationEvent.create(req.body);

  res.status(201).json({
    success: true,
    data: event
  });
});

// @desc    Update celebration event
// @route   PUT /api/team-celebration/events/:id
// @access  Private
export const updateCelebrationEvent = asyncHandler(async (req, res) => {
  const event = await CelebrationEvent.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Celebration event not found'
    });
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc    Delete celebration event
// @route   DELETE /api/team-celebration/events/:id
// @access  Private
export const deleteCelebrationEvent = asyncHandler(async (req, res) => {
  const event = await CelebrationEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Celebration event not found'
    });
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Celebration event deleted successfully'
  });
});

// @desc    Get all team achievements
// @route   GET /api/team-celebration/achievements
// @access  Public
export const getTeamAchievements = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const isActive = req.query.isActive;
  
  // Build query
  let query = {};
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { organization: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }
  
  const skip = (page - 1) * limit;
  
  const [achievements, total] = await Promise.all([
    TeamAchievement.find(query).sort('-year order').skip(skip).limit(limit),
    TeamAchievement.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: achievements.length,
    data: {
      achievements,
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single team achievement
// @route   GET /api/team-celebration/achievements/:id
// @access  Public
export const getTeamAchievement = asyncHandler(async (req, res) => {
  const achievement = await TeamAchievement.findById(req.params.id);

  if (!achievement) {
    return res.status(404).json({
      success: false,
      message: 'Team achievement not found'
    });
  }

  res.status(200).json({
    success: true,
    data: achievement
  });
});

// @desc    Create team achievement
// @route   POST /api/team-celebration/achievements
// @access  Private
export const createTeamAchievement = asyncHandler(async (req, res) => {
  const achievement = await TeamAchievement.create(req.body);

  res.status(201).json({
    success: true,
    data: achievement
  });
});

// @desc    Update team achievement
// @route   PUT /api/team-celebration/achievements/:id
// @access  Private
export const updateTeamAchievement = asyncHandler(async (req, res) => {
  const achievement = await TeamAchievement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!achievement) {
    return res.status(404).json({
      success: false,
      message: 'Team achievement not found'
    });
  }

  res.status(200).json({
    success: true,
    data: achievement
  });
});

// @desc    Delete team achievement
// @route   DELETE /api/team-celebration/achievements/:id
// @access  Private
export const deleteTeamAchievement = asyncHandler(async (req, res) => {
  const achievement = await TeamAchievement.findById(req.params.id);

  if (!achievement) {
    return res.status(404).json({
      success: false,
      message: 'Team achievement not found'
    });
  }

  await achievement.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Team achievement deleted successfully'
  });
});

// @desc    Create team celebration CTA
// @route   POST /api/team-celebration/cta
// @access  Private
export const createTeamCelebrationCTA = asyncHandler(async (req, res) => {
  const cta = await TeamCelebrationCTA.create(req.body);

  res.status(201).json({
    success: true,
    data: cta
  });
});

// @desc    Get team celebration CTA
// @route   GET /api/team-celebration/cta
// @access  Public
export const getTeamCelebrationCTA = asyncHandler(async (req, res) => {
  const cta = await TeamCelebrationCTA.findOne({ isActive: true });
  
  if (!cta) {
    return res.status(404).json({
      success: false,
      message: 'Team celebration CTA not found'
    });
  }

  res.status(200).json({
    success: true,
    data: cta
  });
});

// @desc    Update team celebration CTA
// @route   PUT /api/team-celebration/cta/:id
// @access  Private
export const updateTeamCelebrationCTA = asyncHandler(async (req, res) => {
  const cta = await TeamCelebrationCTA.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!cta) {
    return res.status(404).json({
      success: false,
      message: 'Team celebration CTA not found'
    });
  }

  res.status(200).json({
    success: true,
    data: cta
  });
});

// @desc    Get all team celebration data
// @route   GET /api/team-celebration
// @access  Public
export const getTeamCelebrationData = asyncHandler(async (req, res) => {
  const [hero, culture, events, achievements, cta] = await Promise.all([
    TeamCelebrationHero.findOne({ isActive: true }),
    TeamCulture.findOne({ isActive: true }),
    CelebrationEvent.find({ isActive: true }).sort('order'),
    TeamAchievement.find({ isActive: true }).sort('-year order'),
    TeamCelebrationCTA.findOne({ isActive: true })
  ]);

  res.status(200).json({
    success: true,
    data: {
      hero,
      culture,
      events,
      achievements,
      cta
    }
  });
});