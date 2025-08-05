import { Client } from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Get all clients
export const getAllClients = catchAsync(async (req, res, next) => {
  const clients = await Client.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  
  res.status(200).json({
    status: 'success',
    results: clients.length,
    data: {
      clients
    }
  });
});

// Get client by ID
export const getClient = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.params.id);
  
  if (!client) {
    return next(new AppError('No client found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      client
    }
  });
});

// Create new client
export const createClient = catchAsync(async (req, res, next) => {
  const { name, logo, description, website, industry, order } = req.body;
  
  // Validation
  if (!name || !logo) {
    return next(new AppError('Name and logo are required', 400));
  }
  
  const newClient = await Client.create({
    name: typeof name === 'string' ? name.trim() : name,
    logo: typeof logo === 'string' ? logo.trim() : (logo?.url || logo?.backendUrl || logo),
    description: description ? (typeof description === 'string' ? description.trim() : description) : undefined,
    website: website ? (typeof website === 'string' ? website.trim() : website) : undefined,
    industry: industry ? (typeof industry === 'string' ? industry.trim() : industry) : undefined,
    order: order || 0
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      client: newClient
    }
  });
});

// Update client
export const updateClient = catchAsync(async (req, res, next) => {
  const { name, logo, description, website, industry, order, isActive } = req.body;
  
  const updateData = {};
  
  if (name !== undefined) {
    updateData.name = typeof name === 'string' ? name.trim() : name;
  }
  if (logo !== undefined) {
    updateData.logo = typeof logo === 'string' ? logo.trim() : (logo?.url || logo?.backendUrl || logo);
  }
  if (description !== undefined) {
    updateData.description = typeof description === 'string' ? description.trim() : description;
  }
  if (website !== undefined) {
    updateData.website = typeof website === 'string' ? website.trim() : website;
  }
  if (industry !== undefined) {
    updateData.industry = typeof industry === 'string' ? industry.trim() : industry;
  }
  if (order !== undefined) {
    updateData.order = order;
  }
  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }
  
  const client = await Client.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!client) {
    return next(new AppError('No client found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      client
    }
  });
});

// Delete client
export const deleteClient = catchAsync(async (req, res, next) => {
  const client = await Client.findByIdAndDelete(req.params.id);
  
  if (!client) {
    return next(new AppError('No client found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get clients for frontend (public)
export const getClientsForFrontend = catchAsync(async (req, res, next) => {
  const clients = await Client.find({ isActive: true })
    .sort({ order: 1, createdAt: 1 })
    .select('name logo description website industry order');
  
  res.status(200).json({
    status: 'success',
    results: clients.length,
    data: {
      clients
    }
  });
});