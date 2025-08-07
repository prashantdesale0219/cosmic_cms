import { Footer } from '../models/index.js';
import { APIFeatures } from '../utils/index.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

/**
 * @desc    Get footer data for frontend
 * @route   GET /api/frontend/footer
 * @access  Public
 */
export const getFooterForFrontend = catchAsync(async (req, res, next) => {
  let footer = await Footer.findOne({ isActive: true });
  
  // If no footer exists, create default one
  if (!footer) {
    footer = await Footer.createDefault();
  }
  
  // Filter active sections and sort by order
  if (footer.sections) {
    footer.sections = footer.sections
      .filter(section => section.isActive)
      .sort((a, b) => a.order - b.order)
      .map(section => ({
        ...section.toObject(),
        links: section.links
          ? section.links
              .filter(link => link.isActive)
              .sort((a, b) => a.order - b.order)
          : []
      }));
  }
  
  // Filter active social links and sort by order
  if (footer.socialLinks) {
    footer.socialLinks = footer.socialLinks
      .filter(link => link.isActive)
      .sort((a, b) => a.order - b.order);
  }
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Get footer data for dashboard
 * @route   GET /api/footer
 * @access  Private/Admin
 */
export const getFooter = catchAsync(async (req, res, next) => {
  let footer = await Footer.findOne();
  
  // If no footer exists, create default one
  if (!footer) {
    footer = await Footer.createDefault();
  }
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Update footer data
 * @route   PUT /api/footer/:id
 * @access  Private/Admin
 */
export const updateFooter = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const footer = await Footer.findByIdAndUpdate(
    id,
    { ...req.body, updatedAt: Date.now() },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!footer) {
    return next(new AppError('Footer not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Create footer data
 * @route   POST /api/footer
 * @access  Private/Admin
 */
export const createFooter = catchAsync(async (req, res, next) => {
  // Check if footer already exists
  const existingFooter = await Footer.findOne();
  if (existingFooter) {
    return next(new AppError('Footer already exists. Use update instead.', 400));
  }
  
  const footer = await Footer.create(req.body);
  
  res.status(201).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Add footer section
 * @route   POST /api/footer/:id/sections
 * @access  Private/Admin
 */
export const addFooterSection = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const section = req.body;
  
  const footer = await Footer.findById(id);
  if (!footer) {
    return next(new AppError('Footer not found', 404));
  }
  
  // Set order if not provided
  if (!section.order) {
    section.order = footer.sections.length + 1;
  }
  
  footer.sections.push(section);
  footer.updatedAt = Date.now();
  await footer.save();
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Update footer section
 * @route   PUT /api/footer/:id/sections/:sectionId
 * @access  Private/Admin
 */
export const updateFooterSection = catchAsync(async (req, res, next) => {
  const { id, sectionId } = req.params;
  
  const footer = await Footer.findById(id);
  if (!footer) {
    return next(new AppError('Footer not found', 404));
  }
  
  const section = footer.sections.id(sectionId);
  if (!section) {
    return next(new AppError('Footer section not found', 404));
  }
  
  Object.assign(section, req.body);
  footer.updatedAt = Date.now();
  await footer.save();
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Delete footer section
 * @route   DELETE /api/footer/:id/sections/:sectionId
 * @access  Private/Admin
 */
export const deleteFooterSection = catchAsync(async (req, res, next) => {
  const { id, sectionId } = req.params;
  
  const footer = await Footer.findById(id);
  if (!footer) {
    return next(new AppError('Footer not found', 404));
  }
  
  footer.sections.pull({ _id: sectionId });
  footer.updatedAt = Date.now();
  await footer.save();
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Add link to footer section
 * @route   POST /api/footer/:id/sections/:sectionId/links
 * @access  Private/Admin
 */
export const addSectionLink = catchAsync(async (req, res, next) => {
  const { id, sectionId } = req.params;
  const link = req.body;
  
  const footer = await Footer.findById(id);
  if (!footer) {
    return next(new AppError('Footer not found', 404));
  }
  
  const section = footer.sections.id(sectionId);
  if (!section) {
    return next(new AppError('Footer section not found', 404));
  }
  
  if (!section.links) {
    section.links = [];
  }
  
  // Set order if not provided
  if (!link.order) {
    link.order = section.links.length + 1;
  }
  
  section.links.push(link);
  footer.updatedAt = Date.now();
  await footer.save();
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Update section link
 * @route   PUT /api/footer/:id/sections/:sectionId/links/:linkId
 * @access  Private/Admin
 */
export const updateSectionLink = catchAsync(async (req, res, next) => {
  const { id, sectionId, linkId } = req.params;
  
  const footer = await Footer.findById(id);
  if (!footer) {
    return next(new AppError('Footer not found', 404));
  }
  
  const section = footer.sections.id(sectionId);
  if (!section) {
    return next(new AppError('Footer section not found', 404));
  }
  
  const link = section.links.id(linkId);
  if (!link) {
    return next(new AppError('Section link not found', 404));
  }
  
  Object.assign(link, req.body);
  footer.updatedAt = Date.now();
  await footer.save();
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Delete section link
 * @route   DELETE /api/footer/:id/sections/:sectionId/links/:linkId
 * @access  Private/Admin
 */
export const deleteSectionLink = catchAsync(async (req, res, next) => {
  const { id, sectionId, linkId } = req.params;
  
  const footer = await Footer.findById(id);
  if (!footer) {
    return next(new AppError('Footer not found', 404));
  }
  
  const section = footer.sections.id(sectionId);
  if (!section) {
    return next(new AppError('Footer section not found', 404));
  }
  
  section.links.pull({ _id: linkId });
  footer.updatedAt = Date.now();
  await footer.save();
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Add social link
 * @route   POST /api/footer/:id/social-links
 * @access  Private/Admin
 */
export const addSocialLink = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const socialLink = req.body;
  
  const footer = await Footer.findById(id);
  if (!footer) {
    return next(new AppError('Footer not found', 404));
  }
  
  if (!footer.socialLinks) {
    footer.socialLinks = [];
  }
  
  // Set order if not provided
  if (!socialLink.order) {
    socialLink.order = footer.socialLinks.length + 1;
  }
  
  footer.socialLinks.push(socialLink);
  footer.updatedAt = Date.now();
  await footer.save();
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Update social link
 * @route   PUT /api/footer/:id/social-links/:linkId
 * @access  Private/Admin
 */
export const updateSocialLink = catchAsync(async (req, res, next) => {
  const { id, linkId } = req.params;
  
  const footer = await Footer.findById(id);
  if (!footer) {
    return next(new AppError('Footer not found', 404));
  }
  
  const socialLink = footer.socialLinks.id(linkId);
  if (!socialLink) {
    return next(new AppError('Social link not found', 404));
  }
  
  Object.assign(socialLink, req.body);
  footer.updatedAt = Date.now();
  await footer.save();
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Delete social link
 * @route   DELETE /api/footer/:id/social-links/:linkId
 * @access  Private/Admin
 */
export const deleteSocialLink = catchAsync(async (req, res, next) => {
  const { id, linkId } = req.params;
  
  const footer = await Footer.findById(id);
  if (!footer) {
    return next(new AppError('Footer not found', 404));
  }
  
  footer.socialLinks.pull({ _id: linkId });
  footer.updatedAt = Date.now();
  await footer.save();
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Reorder footer sections
 * @route   PUT /api/footer/:id/sections/reorder
 * @access  Private/Admin
 */
export const reorderFooterSections = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sectionsOrder } = req.body; // Array of section IDs in new order
  
  const footer = await Footer.findById(id);
  if (!footer) {
    return next(new AppError('Footer not found', 404));
  }
  
  // Update order for each section
  sectionsOrder.forEach((sectionId, index) => {
    const section = footer.sections.id(sectionId);
    if (section) {
      section.order = index + 1;
    }
  });
  
  footer.updatedAt = Date.now();
  await footer.save();
  
  res.status(200).json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/footer/newsletter/subscribe
 * @access  Public
 */
export const subscribeNewsletter = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next(new AppError('Email is required', 400));
  }
  
  // Here you can add logic to save email to newsletter subscription
  // For now, we'll just return success
  
  res.status(200).json({
    success: true,
    message: 'Successfully subscribed to newsletter'
  });
});

/**
 * @desc    Initialize footer with default data
 * @route   POST /api/footer/initialize
 * @access  Private/Admin
 */
export const initializeFooter = catchAsync(async (req, res, next) => {
  const existingFooter = await Footer.findOne();
  if (existingFooter) {
    return res.status(200).json({
      success: true,
      message: 'Footer already exists',
      data: existingFooter
    });
  }
  
  const footer = await Footer.createDefault();
  
  res.status(201).json({
    success: true,
    message: 'Footer initialized with default data',
    data: footer
  });
});