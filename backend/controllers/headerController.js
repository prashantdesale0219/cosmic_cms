import { Header } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

/**
 * @desc    Get header data for frontend
 * @route   GET /api/frontend/header
 * @access  Public
 */
export const getHeaderForFrontend = catchAsync(async (req, res, next) => {
  let header = await Header.findOne({ isActive: true });
  
  // If no header exists, create default one
  if (!header) {
    header = await Header.createDefault();
  }
  
  // Filter active navigation items and sort by order
  if (header.navigation) {
    header.navigation = header.navigation
      .filter(item => item.isActive)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        ...item.toObject(),
        submenu: item.submenu
          ? item.submenu
              .filter(subItem => subItem.isActive)
              .sort((a, b) => a.order - b.order)
          : []
      }));
  }
  
  // Filter active social links and sort by order
  if (header.topBar && header.topBar.socialLinks) {
    header.topBar.socialLinks = header.topBar.socialLinks
      .filter(link => link.platform && link.url)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Get header data for dashboard
 * @route   GET /api/header
 * @access  Private/Admin
 */
export const getHeader = catchAsync(async (req, res, next) => {
  let header = await Header.findOne();
  
  // If no header exists, create default one
  if (!header) {
    header = await Header.createDefault();
  }
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Update header data
 * @route   PUT /api/header/:id
 * @access  Private/Admin
 */
export const updateHeader = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const header = await Header.findByIdAndUpdate(
    id,
    { ...req.body, updatedAt: Date.now() },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!header) {
    return next(new AppError('Header not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Create header data
 * @route   POST /api/header
 * @access  Private/Admin
 */
export const createHeader = catchAsync(async (req, res, next) => {
  // Check if header already exists
  const existingHeader = await Header.findOne();
  if (existingHeader) {
    return next(new AppError('Header already exists. Use update instead.', 400));
  }
  
  const header = await Header.create(req.body);
  
  res.status(201).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Add navigation item
 * @route   POST /api/header/:id/navigation
 * @access  Private/Admin
 */
export const addNavigationItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const navigationItem = req.body;
  
  const header = await Header.findById(id);
  if (!header) {
    return next(new AppError('Header not found', 404));
  }
  
  // Set order if not provided
  if (!navigationItem.order) {
    navigationItem.order = header.navigation.length + 1;
  }
  
  header.navigation.push(navigationItem);
  header.updatedAt = Date.now();
  await header.save();
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Update navigation item
 * @route   PUT /api/header/:id/navigation/:navId
 * @access  Private/Admin
 */
export const updateNavigationItem = catchAsync(async (req, res, next) => {
  const { id, navId } = req.params;
  
  const header = await Header.findById(id);
  if (!header) {
    return next(new AppError('Header not found', 404));
  }
  
  const navItem = header.navigation.id(navId);
  if (!navItem) {
    return next(new AppError('Navigation item not found', 404));
  }
  
  Object.assign(navItem, req.body);
  header.updatedAt = Date.now();
  await header.save();
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Delete navigation item
 * @route   DELETE /api/header/:id/navigation/:navId
 * @access  Private/Admin
 */
export const deleteNavigationItem = catchAsync(async (req, res, next) => {
  const { id, navId } = req.params;
  
  const header = await Header.findById(id);
  if (!header) {
    return next(new AppError('Header not found', 404));
  }
  
  header.navigation.pull({ _id: navId });
  header.updatedAt = Date.now();
  await header.save();
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Add submenu item to navigation
 * @route   POST /api/header/:id/navigation/:navId/submenu
 * @access  Private/Admin
 */
export const addSubmenuItem = catchAsync(async (req, res, next) => {
  const { id, navId } = req.params;
  const submenuItem = req.body;
  
  const header = await Header.findById(id);
  if (!header) {
    return next(new AppError('Header not found', 404));
  }
  
  const navItem = header.navigation.id(navId);
  if (!navItem) {
    return next(new AppError('Navigation item not found', 404));
  }
  
  if (!navItem.submenu) {
    navItem.submenu = [];
  }
  
  // Set order if not provided
  if (!submenuItem.order) {
    submenuItem.order = navItem.submenu.length + 1;
  }
  
  navItem.submenu.push(submenuItem);
  header.updatedAt = Date.now();
  await header.save();
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Update submenu item
 * @route   PUT /api/header/:id/navigation/:navId/submenu/:submenuId
 * @access  Private/Admin
 */
export const updateSubmenuItem = catchAsync(async (req, res, next) => {
  const { id, navId, submenuId } = req.params;
  
  const header = await Header.findById(id);
  if (!header) {
    return next(new AppError('Header not found', 404));
  }
  
  const navItem = header.navigation.id(navId);
  if (!navItem) {
    return next(new AppError('Navigation item not found', 404));
  }
  
  const submenuItem = navItem.submenu.id(submenuId);
  if (!submenuItem) {
    return next(new AppError('Submenu item not found', 404));
  }
  
  Object.assign(submenuItem, req.body);
  header.updatedAt = Date.now();
  await header.save();
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Delete submenu item
 * @route   DELETE /api/header/:id/navigation/:navId/submenu/:submenuId
 * @access  Private/Admin
 */
export const deleteSubmenuItem = catchAsync(async (req, res, next) => {
  const { id, navId, submenuId } = req.params;
  
  const header = await Header.findById(id);
  if (!header) {
    return next(new AppError('Header not found', 404));
  }
  
  const navItem = header.navigation.id(navId);
  if (!navItem) {
    return next(new AppError('Navigation item not found', 404));
  }
  
  navItem.submenu.pull({ _id: submenuId });
  header.updatedAt = Date.now();
  await header.save();
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Reorder navigation items
 * @route   PUT /api/header/:id/navigation/reorder
 * @access  Private/Admin
 */
export const reorderNavigation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { navigationOrder } = req.body; // Array of navigation item IDs in new order
  
  const header = await Header.findById(id);
  if (!header) {
    return next(new AppError('Header not found', 404));
  }
  
  // Update order for each navigation item
  navigationOrder.forEach((navId, index) => {
    const navItem = header.navigation.id(navId);
    if (navItem) {
      navItem.order = index + 1;
    }
  });
  
  header.updatedAt = Date.now();
  await header.save();
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Add social link to top bar
 * @route   POST /api/header/:id/social-links
 * @access  Private/Admin
 */
export const addSocialLink = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const socialLink = req.body;
  
  const header = await Header.findById(id);
  if (!header) {
    return next(new AppError('Header not found', 404));
  }
  
  if (!header.topBar) {
    header.topBar = { socialLinks: [] };
  }
  
  if (!header.topBar.socialLinks) {
    header.topBar.socialLinks = [];
  }
  
  // Set order if not provided
  if (!socialLink.order) {
    socialLink.order = header.topBar.socialLinks.length + 1;
  }
  
  header.topBar.socialLinks.push(socialLink);
  header.updatedAt = Date.now();
  await header.save();
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Update social link
 * @route   PUT /api/header/:id/social-links/:linkId
 * @access  Private/Admin
 */
export const updateSocialLink = catchAsync(async (req, res, next) => {
  const { id, linkId } = req.params;
  
  const header = await Header.findById(id);
  if (!header) {
    return next(new AppError('Header not found', 404));
  }
  
  const socialLink = header.topBar.socialLinks.id(linkId);
  if (!socialLink) {
    return next(new AppError('Social link not found', 404));
  }
  
  Object.assign(socialLink, req.body);
  header.updatedAt = Date.now();
  await header.save();
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Delete social link
 * @route   DELETE /api/header/:id/social-links/:linkId
 * @access  Private/Admin
 */
export const deleteSocialLink = catchAsync(async (req, res, next) => {
  const { id, linkId } = req.params;
  
  const header = await Header.findById(id);
  if (!header) {
    return next(new AppError('Header not found', 404));
  }
  
  header.topBar.socialLinks.pull({ _id: linkId });
  header.updatedAt = Date.now();
  await header.save();
  
  res.status(200).json({
    success: true,
    data: header
  });
});

/**
 * @desc    Initialize header with default data
 * @route   POST /api/header/initialize
 * @access  Private/Admin
 */
export const initializeHeader = catchAsync(async (req, res, next) => {
  const existingHeader = await Header.findOne();
  if (existingHeader) {
    return res.status(200).json({
      success: true,
      message: 'Header already exists',
      data: existingHeader
    });
  }
  
  const header = await Header.createDefault();
  
  res.status(201).json({
    success: true,
    message: 'Header initialized with default data',
    data: header
  });
});