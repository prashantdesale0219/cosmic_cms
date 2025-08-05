import { Timeline } from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Get all timeline items
export const getAllTimeline = catchAsync(async (req, res, next) => {
  const timeline = await Timeline.find({ isActive: true }).sort({ order: 1, year: 1 });
  
  res.status(200).json({
    status: 'success',
    results: timeline.length,
    data: {
      timeline
    }
  });
});

// Get timeline item by ID
export const getTimelineItem = catchAsync(async (req, res, next) => {
  const timelineItem = await Timeline.findById(req.params.id);
  
  if (!timelineItem) {
    return next(new AppError('No timeline item found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      timelineItem
    }
  });
});

// Create new timeline item
export const createTimelineItem = catchAsync(async (req, res, next) => {
  const { year, title, description, backgroundImage, order } = req.body;
  
  // Validation
  if (!year || !title || !description || !backgroundImage) {
    return next(new AppError('Year, title, description and background image are required', 400));
  }
  
  const newTimelineItem = await Timeline.create({
    year: typeof year === 'string' ? year.trim() : year,
    title: typeof title === 'string' ? title.trim() : title,
    description: typeof description === 'string' ? description.trim() : description,
    backgroundImage: typeof backgroundImage === 'string' ? backgroundImage.trim() : (backgroundImage?.url || backgroundImage?.backendUrl || backgroundImage),
    order: order || 0
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      timelineItem: newTimelineItem
    }
  });
});

// Update timeline item
export const updateTimelineItem = catchAsync(async (req, res, next) => {
  const { year, title, description, backgroundImage, order, isActive } = req.body;
  
  const updateData = {};
  
  if (year !== undefined) {
    updateData.year = typeof year === 'string' ? year.trim() : year;
  }
  if (title !== undefined) {
    updateData.title = typeof title === 'string' ? title.trim() : title;
  }
  if (description !== undefined) {
    updateData.description = typeof description === 'string' ? description.trim() : description;
  }
  if (backgroundImage !== undefined) {
    updateData.backgroundImage = typeof backgroundImage === 'string' ? backgroundImage.trim() : (backgroundImage?.url || backgroundImage?.backendUrl || backgroundImage);
  }
  if (order !== undefined) {
    updateData.order = order;
  }
  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }
  
  const timelineItem = await Timeline.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!timelineItem) {
    return next(new AppError('No timeline item found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      timelineItem
    }
  });
});

// Delete timeline item
export const deleteTimelineItem = catchAsync(async (req, res, next) => {
  const timelineItem = await Timeline.findByIdAndDelete(req.params.id);
  
  if (!timelineItem) {
    return next(new AppError('No timeline item found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get timeline for frontend
export const getTimelineForFrontend = catchAsync(async (req, res, next) => {
  const timeline = await Timeline.find({ isActive: true })
    .sort({ order: 1, year: 1 })
    .select('year title description backgroundImage order');
  
  res.status(200).json({
    status: 'success',
    results: timeline.length,
    data: {
      timeline
    }
  });
});