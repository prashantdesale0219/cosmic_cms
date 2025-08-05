import express from 'express';
import * as servicesController from '../controllers/servicesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/all', servicesController.getAllServicesData);
router.get('/hero', servicesController.getServiceHero);
router.get('/main-services', servicesController.getAllMainServices);
router.get('/main-services/:id', servicesController.getMainService);
router.get('/additional-services', servicesController.getAllAdditionalServices);
router.get('/additional-services/:id', servicesController.getAdditionalService);
router.get('/process-steps', servicesController.getAllProcessSteps);
router.get('/process-steps/:id', servicesController.getProcessStep);
router.get('/cta', servicesController.getServiceCta);
router.get('/savings-calculator', servicesController.getSavingsCalculator);

// Protected routes (require authentication)
router.use(protect);

// Service Hero routes
router.post('/hero', servicesController.createServiceHero);
router.patch('/hero/:id', servicesController.updateServiceHero);

// Main Services routes
router.post('/main-services', servicesController.createMainService);
router.patch('/main-services/:id', servicesController.updateMainService);
router.delete('/main-services/:id', servicesController.deleteMainService);

// Additional Services routes
router.post('/additional-services', servicesController.createAdditionalService);
router.patch('/additional-services/:id', servicesController.updateAdditionalService);
router.delete('/additional-services/:id', servicesController.deleteAdditionalService);

// Process Steps routes
router.post('/process-steps', servicesController.createProcessStep);
router.patch('/process-steps/:id', servicesController.updateProcessStep);
router.delete('/process-steps/:id', servicesController.deleteProcessStep);

// Service CTA routes
router.post('/cta', servicesController.createServiceCta);
router.patch('/cta/:id', servicesController.updateServiceCta);

// Savings Calculator routes
router.post('/savings-calculator', servicesController.createSavingsCalculator);
router.patch('/savings-calculator/:id', servicesController.updateSavingsCalculator);

export default router;