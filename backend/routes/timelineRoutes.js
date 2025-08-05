import express from 'express';
import {
  getAllTimeline,
  getTimelineItem,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
  getTimelineForFrontend
} from '../controllers/timelineController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for frontend
router.get('/frontend', getTimelineForFrontend);

// Protected routes for dashboard
router.use(protect);
router.use(restrictTo('admin', 'editor'));

router
  .route('/')
  .get(getAllTimeline)
  .post(createTimelineItem);

router
  .route('/:id')
  .get(getTimelineItem)
  .put(updateTimelineItem)
  .delete(deleteTimelineItem);

export default router;