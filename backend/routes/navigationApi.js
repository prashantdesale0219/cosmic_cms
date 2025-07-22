import express from 'express';
const router = express.Router();

// Import navigation controller
import { getNavigationByLocation } from '../controllers/navigationController.js';

// Navigation routes
router.get('/location/:location', getNavigationByLocation);

export default router;