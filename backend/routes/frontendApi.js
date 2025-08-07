import express from 'express';
const router = express.Router();

// Import models directly for inline route handlers
import { Tag } from '../models/index.js';

// Import controllers
import {
  getActiveHeroSlides,
  getFeaturedHeroSlides
} from '../controllers/heroController.js';

import {
  getGreenFuture
} from '../controllers/greenFutureController.js';

import {
  getActiveEnergySolutions,
  getFeaturedEnergySolutions,
  getEnergySolutionBySlug
} from '../controllers/energySolutionController.js';

import {
  getActiveFaqs,
  getFaqsByCategory
} from '../controllers/faqController.js';

import {
  getActiveBlogPosts,
  getFeaturedBlogPosts,
  getBlogPostsByCategory,
  getBlogPostsByTag,
  getBlogPostById,
  getBlogPostBySlug,
  searchBlogPosts
} from '../controllers/blogPostController.js';

import {
  getActiveProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getProductById,
  getProductBySlug,
  searchProducts
} from '../controllers/productController.js';

import {
  getActiveProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getProjectById,
  getProjectBySlug,
  searchProjects
} from '../controllers/projectController.js';

// Solar Solution controller imports moved to solarSolutionRoutes.js

import {
  createContact,
  getContactById
} from '../controllers/contactController.js';

import {
  getActiveTestimonials,
  getFeaturedTestimonials
} from '../controllers/testimonialController.js';

import {
  getActiveTeamMembers,
  getFeaturedTeamMembers
} from '../controllers/teamController.js';

// Import category controller (now using default export)
import categoryController from '../controllers/categoryController.js';

// Import tag controller (now using default export)
import tagController from '../controllers/tagController.js';

import {
  getSettings,
  getPublicSettings,
  submitPublicSettings
} from '../controllers/settingController.js';

// Import frontend controller
import {
  getHomepageData,
  getAboutPageData,
  updateHomepageData,
  submitContactForm
} from '../controllers/frontendController.js';

import {
  getClientsForFrontend
} from '../controllers/clientController.js';

import {
  getTimelineForFrontend
} from '../controllers/timelineController.js';

import {
  getServiceHero,
  getAllMainServices,
  getAllAdditionalServices,
  getAllProcessSteps,
  getServiceCta,
  getSavingsCalculator,
  getAllServicesData
} from '../controllers/servicesController.js';

import {
  getHeaderForFrontend
} from '../controllers/headerController.js';

import {
  getFooterForFrontend
} from '../controllers/footerController.js';



// Import director routes
import directorRoutes from './directorRoutes.js';

// Import company culture routes
import companyCultureRoutes from './companyCultureRoutes.js';

// Import team celebration routes
import teamCelebrationRoutes from './teamCelebrationRoutes.js';

// Header and Footer routes
router.get('/header', getHeaderForFrontend);
router.get('/footer', getFooterForFrontend);

// Combined data routes
router.get('/homepage', getHomepageData);
router.post('/homepage', updateHomepageData);
router.get('/about', getAboutPageData);

// Hero routes
router.get('/heroes', getActiveHeroSlides);
router.get('/heroes/featured', getFeaturedHeroSlides);

// GreenFuture routes
router.get('/green-future', getGreenFuture);

// Energy Solution routes
router.get('/energy-solutions', getActiveEnergySolutions);
router.get('/energy-solutions/featured', getFeaturedEnergySolutions);
router.get('/energy-solutions/:slug', getEnergySolutionBySlug);

// Solar Solution routes moved to solarSolutionRoutes.js

// FAQ routes
router.get('/faqs', getActiveFaqs);
router.get('/faqs/category/:categoryId', getFaqsByCategory);

// Blog routes
router.get('/blogs', getActiveBlogPosts);
router.get('/blogs/featured', getFeaturedBlogPosts);
router.get('/blogs/category/:categoryId', getBlogPostsByCategory);
router.get('/blogs/tag/:tagId', getBlogPostsByTag);
router.get('/blogs/search', searchBlogPosts);
router.get('/blogs/:id', getBlogPostById);
router.get('/blogs/slug/:slug', getBlogPostBySlug);

// Duplicate blog routes with blog-posts prefix to match frontend API service
router.get('/blog-posts', getActiveBlogPosts);
router.get('/blog-posts/featured', getFeaturedBlogPosts);
router.get('/blog-posts/category/:categoryId', getBlogPostsByCategory);
router.get('/blog-posts/tag/:tagId', getBlogPostsByTag);
router.get('/blog-posts/search', searchBlogPosts);
router.get('/blog-posts/:id', getBlogPostById);
router.get('/blog-posts/slug/:slug', getBlogPostBySlug);
router.get('/blog-posts/active', getActiveBlogPosts);

// Product routes
router.get('/products', getActiveProducts);
router.get('/products/featured', getFeaturedProducts);
router.get('/products/category/:categoryId', getProductsByCategory);
router.get('/products/search', searchProducts);
router.get('/products/:id', getProductById);
router.get('/products/slug/:slug', getProductBySlug);

// Project routes
router.get('/projects', getActiveProjects);
router.get('/projects/featured', getFeaturedProjects);
router.get('/projects/category/:categoryId', getProjectsByCategory);
router.get('/projects/search', searchProjects);
router.get('/projects/:id', getProjectById);
router.get('/projects/slug/:slug', getProjectBySlug);

// Contact routes
router.post('/contact', submitContactForm); // Use the frontend controller
router.get('/contact/:id', getContactById);

// Testimonial routes
router.get('/testimonials', getActiveTestimonials);
router.get('/testimonials/featured', getFeaturedTestimonials);

// Team routes
router.get('/team', getActiveTeamMembers);
router.get('/team/featured', getFeaturedTeamMembers);

// Category routes
router.get('/categories', categoryController.getActiveCategories);

// Tag routes
// Using a different approach to avoid ESM caching issues
router.get('/tags', async (req, res) => {
  try {
    const tags = await Tag.find({ isActive: true }).sort('order');
    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Settings routes
router.get('/settings', getSettings);
router.get('/settings/public', getPublicSettings);
router.post('/settings/public', submitPublicSettings);
router.post('/settings', getSettings);

// Clients routes
router.get('/clients', getClientsForFrontend);

// Timeline routes
router.get('/timeline', getTimelineForFrontend);

// Services routes for frontend
router.get('/services/hero', getServiceHero);
router.get('/services/main', getAllMainServices);
router.get('/services/additional', getAllAdditionalServices);
router.get('/services/process-steps', getAllProcessSteps);
router.get('/services/cta', getServiceCta);
router.get('/services/savings-calculator', getSavingsCalculator);
router.get('/services/all', getAllServicesData);

// Director routes
router.use('/director', directorRoutes);

// Company Culture routes
router.use('/company-culture', companyCultureRoutes);

// Team Celebration routes
router.use('/team-celebration', teamCelebrationRoutes);

export default router;