import express from 'express';
import {
  getAllClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientsForFrontend
} from '../controllers/clientController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for frontend
router.get('/frontend', getClientsForFrontend);

// Protected routes for dashboard
router.use(protect);
router.use(restrictTo('admin', 'editor'));

router
  .route('/')
  .get(getAllClients)
  .post(createClient);

router
  .route('/:id')
  .get(getClient)
  .put(updateClient)
  .delete(deleteClient);

export default router;