import {
  CompanyCultureHero,
  BrandVision,
  CoreValue,
  WorkEnvironment,
  SustainabilityCard,
  SustainabilityCommitment,
  JoinTeamCTA
} from '../models/index.js';
import { catchAsync } from '../utils/index.js';
import AppError from '../utils/appError.js';

// Company Culture Hero Controllers
export const createCompanyCultureHero = catchAsync(async (req, res, next) => {
  const hero = await CompanyCultureHero.create(req.body);
  res.status(201).json({
    success: true,
    data: hero
  });
});

export const getCompanyCultureHero = catchAsync(async (req, res, next) => {
  const hero = await CompanyCultureHero.findOne({ isActive: true });
  res.status(200).json({
    success: true,
    data: hero
  });
});

export const updateCompanyCultureHero = catchAsync(async (req, res, next) => {
  const hero = await CompanyCultureHero.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!hero) {
    return next(new AppError('Hero not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: hero
  });
});

export const deleteCompanyCultureHero = catchAsync(async (req, res, next) => {
  const hero = await CompanyCultureHero.findByIdAndDelete(req.params.id);
  
  if (!hero) {
    return next(new AppError('Hero not found', 404));
  }
  
  res.status(204).json({
    success: true,
    data: null
  });
});

// Brand Vision Controllers
export const createBrandVision = catchAsync(async (req, res, next) => {
  const brandVision = await BrandVision.create(req.body);
  res.status(201).json({
    success: true,
    data: brandVision
  });
});

export const getBrandVision = catchAsync(async (req, res, next) => {
  const brandVision = await BrandVision.findOne({ isActive: true });
  res.status(200).json({
    success: true,
    data: brandVision
  });
});

export const updateBrandVision = catchAsync(async (req, res, next) => {
  const brandVision = await BrandVision.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!brandVision) {
    return next(new AppError('Brand Vision not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: brandVision
  });
});

export const deleteBrandVision = catchAsync(async (req, res, next) => {
  const brandVision = await BrandVision.findByIdAndDelete(req.params.id);
  
  if (!brandVision) {
    return next(new AppError('Brand Vision not found', 404));
  }
  
  res.status(204).json({
    success: true,
    data: null
  });
});

// Core Values Controllers
export const createCoreValue = catchAsync(async (req, res, next) => {
  const coreValue = await CoreValue.create(req.body);
  res.status(201).json({
    success: true,
    data: coreValue
  });
});

export const getCoreValues = catchAsync(async (req, res, next) => {
  const coreValues = await CoreValue.find({ isActive: true }).sort({ order: 1 });
  res.status(200).json({
    success: true,
    data: coreValues
  });
});

export const getCoreValueById = catchAsync(async (req, res, next) => {
  const coreValue = await CoreValue.findById(req.params.id);
  
  if (!coreValue) {
    return next(new AppError('Core Value not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: coreValue
  });
});

export const updateCoreValue = catchAsync(async (req, res, next) => {
  const coreValue = await CoreValue.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!coreValue) {
    return next(new AppError('Core Value not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: coreValue
  });
});

export const deleteCoreValue = catchAsync(async (req, res, next) => {
  const coreValue = await CoreValue.findByIdAndDelete(req.params.id);
  
  if (!coreValue) {
    return next(new AppError('Core Value not found', 404));
  }
  
  res.status(204).json({
    success: true,
    data: null
  });
});

// Work Environment Controllers
export const createWorkEnvironment = catchAsync(async (req, res, next) => {
  const workEnvironment = await WorkEnvironment.create(req.body);
  res.status(201).json({
    success: true,
    data: workEnvironment
  });
});

export const getWorkEnvironment = catchAsync(async (req, res, next) => {
  const workEnvironment = await WorkEnvironment.findOne({ isActive: true });
  res.status(200).json({
    success: true,
    data: workEnvironment
  });
});

export const updateWorkEnvironment = catchAsync(async (req, res, next) => {
  const workEnvironment = await WorkEnvironment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!workEnvironment) {
    return next(new AppError('Work Environment not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: workEnvironment
  });
});

export const deleteWorkEnvironment = catchAsync(async (req, res, next) => {
  const workEnvironment = await WorkEnvironment.findByIdAndDelete(req.params.id);
  
  if (!workEnvironment) {
    return next(new AppError('Work Environment not found', 404));
  }
  
  res.status(204).json({
    success: true,
    data: null
  });
});

// Sustainability Cards Controllers
export const createSustainabilityCard = catchAsync(async (req, res, next) => {
  const sustainabilityCard = await SustainabilityCard.create(req.body);
  res.status(201).json({
    success: true,
    data: sustainabilityCard
  });
});

export const getSustainabilityCards = catchAsync(async (req, res, next) => {
  const sustainabilityCards = await SustainabilityCard.find({ isActive: true }).sort({ order: 1 });
  res.status(200).json({
    success: true,
    data: sustainabilityCards
  });
});

export const getSustainabilityCardById = catchAsync(async (req, res, next) => {
  const sustainabilityCard = await SustainabilityCard.findById(req.params.id);
  
  if (!sustainabilityCard) {
    return next(new AppError('Sustainability Card not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: sustainabilityCard
  });
});

export const updateSustainabilityCard = catchAsync(async (req, res, next) => {
  const sustainabilityCard = await SustainabilityCard.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!sustainabilityCard) {
    return next(new AppError('Sustainability Card not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: sustainabilityCard
  });
});

export const deleteSustainabilityCard = catchAsync(async (req, res, next) => {
  const sustainabilityCard = await SustainabilityCard.findByIdAndDelete(req.params.id);
  
  if (!sustainabilityCard) {
    return next(new AppError('Sustainability Card not found', 404));
  }
  
  res.status(204).json({
    success: true,
    data: null
  });
});

// Sustainability Commitment Controllers
export const createSustainabilityCommitment = catchAsync(async (req, res, next) => {
  const sustainabilityCommitment = await SustainabilityCommitment.create(req.body);
  res.status(201).json({
    success: true,
    data: sustainabilityCommitment
  });
});

export const getSustainabilityCommitment = catchAsync(async (req, res, next) => {
  const sustainabilityCommitment = await SustainabilityCommitment.findOne({ isActive: true });
  res.status(200).json({
    success: true,
    data: sustainabilityCommitment
  });
});

export const updateSustainabilityCommitment = catchAsync(async (req, res, next) => {
  const sustainabilityCommitment = await SustainabilityCommitment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!sustainabilityCommitment) {
    return next(new AppError('Sustainability Commitment not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: sustainabilityCommitment
  });
});

export const deleteSustainabilityCommitment = catchAsync(async (req, res, next) => {
  const sustainabilityCommitment = await SustainabilityCommitment.findByIdAndDelete(req.params.id);
  
  if (!sustainabilityCommitment) {
    return next(new AppError('Sustainability Commitment not found', 404));
  }
  
  res.status(204).json({
    success: true,
    data: null
  });
});

// Join Team CTA Controllers
export const createJoinTeamCTA = catchAsync(async (req, res, next) => {
  const joinTeamCTA = await JoinTeamCTA.create(req.body);
  res.status(201).json({
    success: true,
    data: joinTeamCTA
  });
});

export const getJoinTeamCTA = catchAsync(async (req, res, next) => {
  const joinTeamCTA = await JoinTeamCTA.findOne({ isActive: true });
  res.status(200).json({
    success: true,
    data: joinTeamCTA
  });
});

export const updateJoinTeamCTA = catchAsync(async (req, res, next) => {
  const joinTeamCTA = await JoinTeamCTA.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!joinTeamCTA) {
    return next(new AppError('Join Team CTA not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: joinTeamCTA
  });
});

export const deleteJoinTeamCTA = catchAsync(async (req, res, next) => {
  const joinTeamCTA = await JoinTeamCTA.findByIdAndDelete(req.params.id);
  
  if (!joinTeamCTA) {
    return next(new AppError('Join Team CTA not found', 404));
  }
  
  res.status(204).json({
    success: true,
    data: null
  });
});

// Get all company culture data
export const getAllCompanyCultureData = catchAsync(async (req, res, next) => {
  const [hero, brandVision, coreValues, workEnvironment, sustainabilityCards, sustainabilityCommitment, joinTeamCTA] = await Promise.all([
    CompanyCultureHero.findOne({ isActive: true }),
    BrandVision.findOne({ isActive: true }),
    CoreValue.find({ isActive: true }).sort({ order: 1 }),
    WorkEnvironment.findOne({ isActive: true }),
    SustainabilityCard.find({ isActive: true }).sort({ order: 1 }),
    SustainabilityCommitment.findOne({ isActive: true }),
    JoinTeamCTA.findOne({ isActive: true })
  ]);

  res.status(200).json({
    success: true,
    data: {
      hero,
      brandVision,
      coreValues,
      workEnvironment,
      sustainabilityCards,
      sustainabilityCommitment,
      joinTeamCTA
    }
  });
});