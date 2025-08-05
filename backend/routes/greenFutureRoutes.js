import express from 'express';
import {
  getGreenFuture,
  createOrUpdateGreenFuture,
  addNewsCard,
  updateNewsCard,
  deleteNewsCard
} from '../controllers/greenFutureController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getGreenFuture);

// Admin routes
router.post('/', protect, admin, createOrUpdateGreenFuture);
router.post('/news-cards', protect, admin, addNewsCard);
router.put('/news-cards/:id', protect, admin, updateNewsCard);
router.delete('/news-cards/:id', protect, admin, deleteNewsCard);

export default router;