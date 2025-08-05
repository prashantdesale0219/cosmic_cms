import express from 'express';
import {
  createSolarSolution,
  getSolarSolutions,
  getActiveSolarSolutions,
  getFeaturedSolarSolutions,
  getSolarSolutionsByCategory,
  getSolarSolutionById,
  getSolarSolutionBySlug,
  updateSolarSolution,
  deleteSolarSolution,
  updateSolarSolutionOrder
} from '../controllers/solarSolutionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getSolarSolutions);
router.get('/active', getActiveSolarSolutions);
router.get('/featured', getFeaturedSolarSolutions);
router.get('/category/:category', getSolarSolutionsByCategory);
router.get('/slug/:slug', getSolarSolutionBySlug);
router.get('/id/:id', getSolarSolutionById);
router.get('/:id', getSolarSolutionById); // Keep for backward compatibility

// Protected routes (admin only)
router.use(protect);
router.use(admin);

router.post('/', createSolarSolution);
router.put('/reorder', updateSolarSolutionOrder);
router.put('/:id', updateSolarSolution);
router.delete('/:id', deleteSolarSolution);

export default router;