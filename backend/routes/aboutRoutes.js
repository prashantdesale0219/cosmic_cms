import express from 'express';
import * as aboutController from '../controllers/aboutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/all', aboutController.getAllAboutData);
router.get('/hero', aboutController.getAboutHero);
router.get('/about-us', aboutController.getAboutUs);
router.get('/who-we-are', aboutController.getWhoWeAre);
router.get('/our-expertise', aboutController.getOurExpertise);
router.get('/why-choose-cosmic', aboutController.getWhyChooseCosmic);
router.get('/vision-mission-values', aboutController.getVisionMissionValues);

// Protected routes (require authentication)
router.use(protect);

// About Hero routes
router.post('/hero', aboutController.createAboutHero);
router.patch('/hero/:id', aboutController.updateAboutHero);

// About Us routes
router.post('/about-us', aboutController.createAboutUs);
router.patch('/about-us/:id', aboutController.updateAboutUs);

// Who We Are routes
router.post('/who-we-are', aboutController.createWhoWeAre);
router.patch('/who-we-are/:id', aboutController.updateWhoWeAre);

// Our Expertise routes
router.post('/our-expertise', aboutController.createOurExpertise);
router.patch('/our-expertise/:id', aboutController.updateOurExpertise);
router.post('/our-expertise/:id/industries', aboutController.addIndustry);
router.patch('/our-expertise/:id/industries/:industryId', aboutController.updateIndustry);
router.delete('/our-expertise/:id/industries/:industryId', aboutController.deleteIndustry);

// Why Choose Cosmic routes
router.post('/why-choose-cosmic', aboutController.createWhyChooseCosmic);
router.patch('/why-choose-cosmic/:id', aboutController.updateWhyChooseCosmic);

// Vision Mission Values routes
router.post('/vision-mission-values', aboutController.createVisionMissionValues);
router.patch('/vision-mission-values/:id', aboutController.updateVisionMissionValues);

export default router;