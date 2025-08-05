import express from 'express';
import { Director, DirectorHero, DirectorCTA } from '../models/index.js';
import { protect, admin } from '../middleware/index.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

const router = express.Router();

// ============ DIRECTOR ROUTES ============

// Get all director page data (public)
router.get('/all', catchAsync(async (req, res) => {
  // Get directors
  const directors = await Director.find({ isActive: true }).sort({ order: 1 });
  
  // Get hero data
  const heroData = await DirectorHero.findOne({ isActive: true });
  
  // Get CTA data
  const ctaData = await DirectorCTA.findOne({ isActive: true });
  
  res.status(200).json({
    status: 'success',
    data: {
      directors,
      heroData,
      ctaData
    }
  });
}));

// Get all directors (public)
router.get('/directors', catchAsync(async (req, res) => {
  const features = new APIFeatures(Director.find({ isActive: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const directors = await features.query.sort({ order: 1 });
  
  res.status(200).json({
    status: 'success',
    results: directors.length,
    data: {
      directors
    }
  });
}));

// Get single director (public)
router.get('/directors/:id', catchAsync(async (req, res, next) => {
  const director = await Director.findById(req.params.id);
  
  if (!director) {
    return next(new AppError('Director not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      director
    }
  });
}));

// Create director (admin only)
router.post('/directors', protect, admin, catchAsync(async (req, res) => {
  const director = await Director.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      director
    }
  });
}));

// Update director (admin only)
router.patch('/directors/:id', protect, admin, catchAsync(async (req, res, next) => {
  const director = await Director.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!director) {
    return next(new AppError('Director not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      director
    }
  });
}));

// Delete director (admin only)
router.delete('/directors/:id', protect, admin, catchAsync(async (req, res, next) => {
  const director = await Director.findByIdAndDelete(req.params.id);
  
  if (!director) {
    return next(new AppError('Director not found', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
}));

// ============ DIRECTOR HERO ROUTES ============

// Get director hero (public)
router.get('/hero', catchAsync(async (req, res) => {
  const hero = await DirectorHero.findOne({ isActive: true });
  
  res.status(200).json({
    status: 'success',
    data: {
      hero
    }
  });
}));

// Update director hero (admin only)
router.patch('/hero/:id', protect, admin, catchAsync(async (req, res, next) => {
  const hero = await DirectorHero.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!hero) {
    return next(new AppError('Director hero not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      hero
    }
  });
}));

// Create director hero (admin only)
router.post('/hero', protect, admin, catchAsync(async (req, res) => {
  const hero = await DirectorHero.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      hero
    }
  });
}));

// ============ DIRECTOR CTA ROUTES ============

// Get director CTA (public)
router.get('/cta', catchAsync(async (req, res) => {
  const cta = await DirectorCTA.findOne({ isActive: true });
  
  res.status(200).json({
    status: 'success',
    data: {
      cta
    }
  });
}));

// Update director CTA (admin only)
router.patch('/cta/:id', protect, admin, catchAsync(async (req, res, next) => {
  const cta = await DirectorCTA.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!cta) {
    return next(new AppError('Director CTA not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      cta
    }
  });
}));

// Create director CTA (admin only)
router.post('/cta', protect, admin, catchAsync(async (req, res) => {
  const cta = await DirectorCTA.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      cta
    }
  });
}));

// ============ BULK OPERATIONS ============

// Get all director page data (public)
router.get('/page-data', catchAsync(async (req, res) => {
  const [directors, hero, cta] = await Promise.all([
    Director.find({ isActive: true }).sort({ order: 1 }),
    DirectorHero.findOne({ isActive: true }),
    DirectorCTA.findOne({ isActive: true })
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      directors,
      hero,
      cta
    }
  });
}));

export default router;