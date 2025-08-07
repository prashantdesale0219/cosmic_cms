import express from 'express';
import {
  getHeader,
  updateHeader,
  createHeader,
  addNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  addSubmenuItem,
  updateSubmenuItem,
  deleteSubmenuItem,
  reorderNavigation,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  initializeHeader
} from '../controllers/headerController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Initialize header with default data
router.post('/initialize', protect, restrictTo('admin'), initializeHeader);

// Basic CRUD operations
router
  .route('/')
  .get(protect, restrictTo('admin'), getHeader)
  .post(protect, restrictTo('admin'), createHeader);

router
  .route('/:id')
  .put(protect, restrictTo('admin'), updateHeader);

// Navigation items management
router
  .route('/:id/navigation')
  .post(protect, restrictTo('admin'), addNavigationItem);

router
  .route('/:id/navigation/:navId')
  .put(protect, restrictTo('admin'), updateNavigationItem)
  .delete(protect, restrictTo('admin'), deleteNavigationItem);

// Submenu items management
router
  .route('/:id/navigation/:navId/submenu')
  .post(protect, restrictTo('admin'), addSubmenuItem);

router
  .route('/:id/navigation/:navId/submenu/:subId')
  .put(protect, restrictTo('admin'), updateSubmenuItem)
  .delete(protect, restrictTo('admin'), deleteSubmenuItem);

// Reorder navigation items
router
  .route('/:id/navigation/reorder')
  .put(protect, restrictTo('admin'), reorderNavigation);

// Social links management
router
  .route('/:id/social-links')
  .post(protect, restrictTo('admin'), addSocialLink);

router
  .route('/:id/social-links/:linkId')
  .put(protect, restrictTo('admin'), updateSocialLink)
  .delete(protect, restrictTo('admin'), deleteSocialLink);

export default router;