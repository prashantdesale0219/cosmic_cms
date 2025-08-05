import { HappyClient } from '../models/index.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Create a new happy client section
export const createHappyClient = catchAsync(async (req, res, next) => {
  const newHappyClient = await HappyClient.create(req.body);

  res.status(201).json({
    success: true,
    data: newHappyClient
  });
});

// Get all happy client sections
export const getAllHappyClients = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(HappyClient.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const happyClients = await features.query;

  res.status(200).json({
    success: true,
    results: happyClients.length,
    data: happyClients
  });
});

// Get active happy client section
export const getActiveHappyClient = catchAsync(async (req, res, next) => {
  const happyClient = await HappyClient.findOne({ isActive: true });

  if (!happyClient) {
    return next(new AppError('No active happy client section found', 404));
  }

  res.status(200).json({
    success: true,
    data: happyClient
  });
});

// Get a single happy client section by ID
export const getHappyClient = catchAsync(async (req, res, next) => {
  const happyClient = await HappyClient.findById(req.params.id);

  if (!happyClient) {
    return next(new AppError('No happy client section found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    data: happyClient
  });
});

// Update a happy client section
export const updateHappyClient = catchAsync(async (req, res, next) => {
  const happyClient = await HappyClient.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!happyClient) {
    return next(new AppError('No happy client section found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    data: happyClient
  });
});

// Delete a happy client section
export const deleteHappyClient = catchAsync(async (req, res, next) => {
  const happyClient = await HappyClient.findByIdAndDelete(req.params.id);

  if (!happyClient) {
    return next(new AppError('No happy client section found with that ID', 404));
  }

  res.status(204).json({
    success: true,
    data: null
  });
});

// Update stats order
export const updateStatsOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { stats } = req.body;

  if (!Array.isArray(stats)) {
    return next(new AppError('Stats must be an array', 400));
  }

  const happyClient = await HappyClient.findById(id);

  if (!happyClient) {
    return next(new AppError('No happy client section found with that ID', 404));
  }

  // Update the order of each stat
  stats.forEach((stat, index) => {
    const existingStat = happyClient.stats.id(stat._id);
    if (existingStat) {
      existingStat.order = index;
    }
  });

  await happyClient.save();

  res.status(200).json({
    success: true,
    data: happyClient
  });
});