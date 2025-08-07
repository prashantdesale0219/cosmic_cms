import express from 'express';
import {
  getFooter,
  updateFooter,
  createFooter,
  addFooterSection,
  updateFooterSection,
  deleteFooterSection,
  addSectionLink,
  updateSectionLink,
  deleteSectionLink,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderFooterSections,
  subscribeNewsletter,
  initializeFooter
} from '../controllers/footerController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Initialize footer with default data
router.post('/initialize', protect, restrictTo('admin'), initializeFooter);

// Newsletter subscription (public route)
router.post('/newsletter/subscribe', subscribeNewsletter);

// Basic CRUD operations
router
  .route('/')
  .get(protect, restrictTo('admin'), getFooter)
  .post(protect, restrictTo('admin'), createFooter);

router
  .route('/:id')
  .put(protect, restrictTo('admin'), updateFooter);

// Footer sections management
router
  .route('/:id/sections')
  .post(protect, restrictTo('admin'), addFooterSection);

router
  .route('/:id/sections/:sectionId')
  .put(protect, restrictTo('admin'), updateFooterSection)
  .delete(protect, restrictTo('admin'), deleteFooterSection);

// Section links management
router
  .route('/:id/sections/:sectionId/links')
  .post(protect, restrictTo('admin'), addSectionLink);

router
  .route('/:id/sections/:sectionId/links/:linkId')
  .put(protect, restrictTo('admin'), updateSectionLink)
  .delete(protect, restrictTo('admin'), deleteSectionLink);

// Social links management
router
  .route('/:id/social-links')
  .post(protect, restrictTo('admin'), addSocialLink);

router
  .route('/:id/social-links/:linkId')
  .put(protect, restrictTo('admin'), updateSocialLink)
  .delete(protect, restrictTo('admin'), deleteSocialLink);

// Reorder sections
router
  .route('/:id/sections/reorder')
  .put(protect, restrictTo('admin'), reorderFooterSections);

export default router;