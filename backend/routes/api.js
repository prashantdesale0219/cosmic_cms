import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadSingle, uploadMultiple, uploadFields, handleUploadError } from '../middleware/uploadMiddleware.js';

// Import controllers
import {
  getRegisterPage,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  // Email verification imports removed
  changePassword
} from '../controllers/userController.js';

import {
  createHeroSlide as createHero,
  getHeroSlides as getHeroes,
  getActiveHeroSlides as getActiveHeroes,
  getFeaturedHeroSlides as getFeaturedHeroes,
  getHeroSlideById as getHeroById,
  updateHeroSlide as updateHero,
  deleteHeroSlide as deleteHero,
  reorderHeroSlides as reorderHeroes
} from '../controllers/heroController.js';

import {
  createEnergySolution,
  getEnergySolutions,
  getActiveEnergySolutions,
  getFeaturedEnergySolutions,
  getEnergySolutionById,
  getEnergySolutionBySlug,
  updateEnergySolution,
  deleteEnergySolution,
  reorderEnergySolutions
} from '../controllers/energySolutionController.js';

import {
  createFaq,
  getFaqs,
  getActiveFaqs,
  getFaqsByCategory,
  getFaqById,
  updateFaq,
  deleteFaq,
  reorderFaqs,
  bulkCreateFaqs
} from '../controllers/faqController.js';

import {
  createBlogPost,
  getBlogPosts,
  getActiveBlogPosts,
  getFeaturedBlogPosts,
  getBlogPostsByCategory,
  getBlogPostsByTag,
  getBlogPostById,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
  searchBlogPosts
} from '../controllers/blogPostController.js';

import {
  createProduct,
  getProducts,
  getActiveProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  reorderProducts,
  searchProducts
} from '../controllers/productController.js';

import {
  createProject,
  getProjects,
  getActiveProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
  reorderProjects,
  searchProjects
} from '../controllers/projectController.js';

import {
  createJourneyMilestone,
  getJourneyMilestones,
  getActiveJourneyMilestones,
  getJourneyMilestoneById,
  updateJourneyMilestone,
  deleteJourneyMilestone,
  reorderJourneyMilestones
} from '../controllers/journeyController.js';

import {
  createCO2EmissionReduction,
  getCO2EmissionReductions,
  getActiveCO2EmissionReductions,
  getCO2EmissionReductionById,
  updateCO2EmissionReduction,
  deleteCO2EmissionReduction,
  reorderCO2EmissionReductions
} from '../controllers/co2EmissionReductionController.js';

import {
  createIntelligentSolution,
  getIntelligentSolutions,
  getActiveIntelligentSolutions,
  getIntelligentSolutionById,
  updateIntelligentSolution,
  deleteIntelligentSolution,
  reorderIntelligentSolutions
} from '../controllers/intelligentSolutionController.js';

import {
  createContact,
  getContacts,
  getContactsByStatus,
  getUnreadContacts,
  getAssignedContacts,
  getContactById,
  updateContact,
  markContactAsRead,
  assignContact,
  updateContactStatus,
  addContactNotes,
  deleteContact,
  getContactStats,
  getDashboardStats
} from '../controllers/contactController.js';

// Import setting controller functions
import {
  updateMaintenanceMode,
  updateSocialMedia,
  updateSeoSettings,
  updateContactInfo,
  updateScripts
} from '../controllers/settingController.js';

import {
  createTestimonial,
  getTestimonials,
  getActiveTestimonials,
  getFeaturedTestimonials,
  getTestimonialsByProjectType,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials
} from '../controllers/testimonialController.js';

import {
  createTeamMember,
  getTeamMembers,
  getActiveTeamMembers,
  getFeaturedTeamMembers,
  getTeamMembersByDepartment,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers
} from '../controllers/teamController.js';

import {
  createCareer,
  getCareers,
  getActiveCareers,
  getFeaturedCareers,
  getCareersByDepartment,
  getCareersByLocation,
  getCareersByType,
  getCareerById,
  getCareerBySlug,
  updateCareer,
  deleteCareer,
  searchCareers
} from '../controllers/careerController.js';

import {
  createMedia,
  getAllMedia,
  getPublicMedia,
  getMediaByType,
  getMediaByFolder,
  getMediaById,
  updateMedia,
  deleteMedia,
  bulkDeleteMedia,
  updateMediaTags,
  getMediaFolders
} from '../controllers/mediaController.js';

import {
  createCategory,
  getCategories,
  getCategoriesByType,
  getFeaturedCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  reorderCategories
} from '../controllers/categoryController.js';

import {
  createTag,
  getTags,
  getTagsByType,
  getTagById,
  getTagBySlug,
  updateTag,
  deleteTag,
  incrementTagCount,
  decrementTagCount
} from '../controllers/tagController.js';

import {
  createMenu,
  getMenus,
  getMenusByLocation,
  getMenuById,
  getMenuBySlug,
  updateMenu,
  deleteMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems
} from '../controllers/menuController.js';

// Import additional setting controller functions
import { 
  getSettings,
  getPublicSettings,
  submitPublicSettings,
  updateSettings
} from '../controllers/settingController.js';

const router = express.Router();

// User routes
router.get('/users/register', getRegisterPage);
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users/profile', protect, getUserProfile);
router.put('/users/profile', protect, updateUserProfile);
router.get('/users', protect, admin, getUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.post('/users/forgot-password', forgotPassword);
router.post('/users/reset-password/:token', resetPassword);
// Email verification routes removed
router.put('/users/change-password', protect, changePassword);

// Hero routes
router.post('/heroes', protect, admin, createHero);
router.get('/heroes', getHeroes);
router.get('/heroes/active', getActiveHeroes);
router.get('/heroes/featured', getFeaturedHeroes);
router.get('/heroes/:id', getHeroById);
router.put('/heroes/:id', protect, admin, updateHero);
router.delete('/heroes/:id', protect, admin, deleteHero);
router.put('/heroes/reorder', protect, admin, reorderHeroes);

// Energy Solution routes
router.post('/energy-solutions', protect, admin, createEnergySolution);
router.get('/energy-solutions', getEnergySolutions);
router.get('/energy-solutions/active', getActiveEnergySolutions);
router.get('/energy-solutions/featured', getFeaturedEnergySolutions);
router.get('/energy-solutions/id/:id', getEnergySolutionById);
router.get('/energy-solutions/slug/:slug', getEnergySolutionBySlug);
router.put('/energy-solutions/:id', protect, admin, updateEnergySolution);
router.delete('/energy-solutions/:id', protect, admin, deleteEnergySolution);
router.put('/energy-solutions/reorder', protect, admin, reorderEnergySolutions);

// FAQ routes
router.post('/faqs', protect, admin, createFaq);
router.post('/faqs/bulk', protect, admin, bulkCreateFaqs);
router.get('/faqs', getFaqs);
router.get('/faqs/active', getActiveFaqs);
router.get('/faqs/category/:categoryId', getFaqsByCategory);
router.get('/faqs/:id', getFaqById);
router.put('/faqs/:id', protect, admin, updateFaq);
router.delete('/faqs/:id', protect, admin, deleteFaq);
router.put('/faqs/reorder', protect, admin, reorderFaqs);

// Blog Post routes
router.post('/blog-posts', protect, admin, createBlogPost);
router.get('/blog-posts', getBlogPosts);
router.get('/blog-posts/active', getActiveBlogPosts);
router.get('/blog-posts/featured', getFeaturedBlogPosts);
router.get('/blog-posts/category/:categoryId', getBlogPostsByCategory);
router.get('/blog-posts/tag/:tagId', getBlogPostsByTag);
router.get('/blog-posts/id/:id', getBlogPostById);
router.get('/blog-posts/slug/:slug', getBlogPostBySlug);
router.put('/blog-posts/:id', protect, admin, updateBlogPost);
router.delete('/blog-posts/:id', protect, admin, deleteBlogPost);
router.get('/blog-posts/search', searchBlogPosts);

// Product routes
router.post('/products', protect, admin, createProduct);
router.get('/products', getProducts);
router.get('/products/active', getActiveProducts);
router.get('/products/featured', getFeaturedProducts);
router.get('/products/category/:categoryId', getProductsByCategory);
router.get('/products/id/:id', getProductById);
router.get('/products/slug/:slug', getProductBySlug);
router.put('/products/:id', protect, admin, updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);
router.put('/products/reorder', protect, admin, reorderProducts);
router.get('/products/search', searchProducts);

// Project routes
router.post('/projects', protect, admin, createProject);
router.get('/projects', getProjects);
router.get('/projects/active', getActiveProjects);
router.get('/projects/featured', getFeaturedProjects);
router.get('/projects/category/:categoryId', getProjectsByCategory);
router.get('/projects/id/:id', getProjectById);
router.get('/projects/slug/:slug', getProjectBySlug);
router.put('/projects/:id', protect, admin, updateProject);
router.delete('/projects/:id', protect, admin, deleteProject);
router.put('/projects/reorder', protect, admin, reorderProjects);
router.get('/projects/search', searchProjects);

// Contact routes
router.post('/contacts', createContact);
router.get('/contacts', protect, admin, getContacts);
router.get('/contacts/status/:status', protect, admin, getContactsByStatus);
router.get('/contacts/unread', protect, admin, getUnreadContacts);
router.get('/contacts/assigned/:userId', protect, getAssignedContacts);
router.get('/contacts/:id', protect, admin, getContactById);
router.put('/contacts/:id', protect, admin, updateContact);
router.put('/contacts/:id/read', protect, admin, markContactAsRead);
router.put('/contacts/:id/assign', protect, admin, assignContact);
router.put('/contacts/:id/status', protect, admin, updateContactStatus);
router.put('/contacts/:id/notes', protect, admin, addContactNotes);
router.delete('/contacts/:id', protect, admin, deleteContact);
router.get('/contacts-stats', protect, admin, getContactStats);
router.get('/dashboard-stats', protect, getDashboardStats);

// Setting routes
router.get('/settings', protect, admin, getSettings);
router.get('/settings/public', getPublicSettings);
router.post('/settings/public', submitPublicSettings);
router.post('/settings', protect, admin, getSettings);
router.put('/settings', protect, admin, updateSettings);
router.put('/settings/maintenance', protect, admin, updateMaintenanceMode);
router.put('/settings/social-media', protect, admin, updateSocialMedia);
router.put('/settings/seo', protect, admin, updateSeoSettings);
router.put('/settings/contact', protect, admin, updateContactInfo);
router.put('/settings/scripts', protect, admin, updateScripts);

// Testimonial routes
router.post('/testimonials', protect, admin, createTestimonial);
router.get('/testimonials', getTestimonials);
router.get('/testimonials/active', getActiveTestimonials);
router.get('/testimonials/featured', getFeaturedTestimonials);
router.get('/testimonials/project-type/:type', getTestimonialsByProjectType);
router.get('/testimonials/:id', getTestimonialById);
router.put('/testimonials/:id', protect, admin, updateTestimonial);
router.delete('/testimonials/:id', protect, admin, deleteTestimonial);
router.put('/testimonials/reorder', protect, admin, reorderTestimonials);

// Team routes
router.post('/team', protect, admin, createTeamMember);
router.get('/team', getTeamMembers);
router.get('/team/active', getActiveTeamMembers);
router.get('/team/featured', getFeaturedTeamMembers);
router.get('/team/department/:department', getTeamMembersByDepartment);
router.get('/team/:id', getTeamMemberById);
router.put('/team/:id', protect, admin, updateTeamMember);
router.delete('/team/:id', protect, admin, deleteTeamMember);
router.put('/team/reorder', protect, admin, reorderTeamMembers);

// Career routes
router.post('/careers', protect, admin, createCareer);
router.get('/careers', getCareers);
router.get('/careers/active', getActiveCareers);
router.get('/careers/featured', getFeaturedCareers);
router.get('/careers/department/:department', getCareersByDepartment);
router.get('/careers/location/:location', getCareersByLocation);
router.get('/careers/type/:type', getCareersByType);
router.get('/careers/id/:id', getCareerById);
router.get('/careers/slug/:slug', getCareerBySlug);
router.put('/careers/:id', protect, admin, updateCareer);
router.delete('/careers/:id', protect, admin, deleteCareer);
router.get('/careers/search', searchCareers);

// Media routes
router.post('/media', protect, uploadMultiple('files', 10), handleUploadError, createMedia);
router.get('/media', protect, getAllMedia);
router.get('/media/public', getPublicMedia);
router.get('/media/type/:type', protect, getMediaByType);
router.get('/media/folder/:folder', protect, getMediaByFolder);
router.get('/media/:id', protect, getMediaById);
router.put('/media/:id', protect, updateMedia);
router.delete('/media/:id', protect, deleteMedia);
router.post('/media/bulk-delete', protect, admin, bulkDeleteMedia);
router.put('/media/:id/tags', protect, updateMediaTags);
router.get('/media-folders', protect, getMediaFolders);

// Category routes
router.post('/categories', protect, admin, createCategory);
router.get('/categories', getCategories);
router.get('/categories/type/:type', getCategoriesByType);
router.get('/categories/featured', getFeaturedCategories);
router.get('/categories/id/:id', getCategoryById);
router.get('/categories/slug/:slug', getCategoryBySlug);
router.put('/categories/:id', protect, admin, updateCategory);
router.delete('/categories/:id', protect, admin, deleteCategory);
router.put('/categories/reorder', protect, admin, reorderCategories);

// Tag routes
router.post('/tags', protect, admin, createTag);
router.get('/tags', getTags);
router.get('/tags/type/:type', getTagsByType);
router.get('/tags/id/:id', getTagById);
router.get('/tags/slug/:slug', getTagBySlug);
router.put('/tags/:id', protect, admin, updateTag);
router.delete('/tags/:id', protect, admin, deleteTag);
router.put('/tags/:id/increment', protect, incrementTagCount);
router.put('/tags/:id/decrement', protect, decrementTagCount);

// Menu routes
router.post('/menus', protect, admin, createMenu);
router.get('/menus', getMenus);
router.get('/menus/location/:location', getMenusByLocation);
router.get('/menus/id/:id', getMenuById);
router.get('/menus/slug/:slug', getMenuBySlug);

// Journey routes
router.post('/journey', protect, admin, createJourneyMilestone);
router.get('/journey', getJourneyMilestones);
router.get('/journey/active', getActiveJourneyMilestones);
router.get('/journey/:id', getJourneyMilestoneById);
router.put('/journey/:id', protect, admin, updateJourneyMilestone);
router.delete('/journey/:id', protect, admin, deleteJourneyMilestone);
router.put('/journey/reorder', protect, admin, reorderJourneyMilestones);

// CO2 Emission Reduction routes
router.post('/co2-emission-reduction', protect, admin, createCO2EmissionReduction);
router.get('/co2-emission-reduction', getCO2EmissionReductions);
router.get('/co2-emission-reduction/active', getActiveCO2EmissionReductions);
router.put('/co2-emission-reduction/reorder', protect, admin, reorderCO2EmissionReductions);
router.get('/co2-emission-reduction/:id', getCO2EmissionReductionById);
router.put('/co2-emission-reduction/:id', protect, admin, updateCO2EmissionReduction);
router.delete('/co2-emission-reduction/:id', protect, admin, deleteCO2EmissionReduction);

// Intelligent Solution routes
router.post('/intelligent-solution', protect, admin, createIntelligentSolution);
router.get('/intelligent-solution', getIntelligentSolutions);
router.get('/intelligent-solution/active', getActiveIntelligentSolutions);
router.put('/intelligent-solution/reorder', protect, admin, reorderIntelligentSolutions);
router.get('/intelligent-solution/:id', getIntelligentSolutionById);
router.put('/intelligent-solution/:id', protect, admin, updateIntelligentSolution);
router.delete('/intelligent-solution/:id', protect, admin, deleteIntelligentSolution);
router.put('/menus/:id', protect, admin, updateMenu);
router.delete('/menus/:id', protect, admin, deleteMenu);
router.post('/menus/:id/items', protect, admin, addMenuItem);
router.put('/menus/:id/items/:itemId', protect, admin, updateMenuItem);
router.delete('/menus/:id/items/:itemId', protect, admin, deleteMenuItem);
router.put('/menus/:id/reorder', protect, admin, reorderMenuItems);

export default router;