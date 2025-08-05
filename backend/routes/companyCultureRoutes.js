import express from 'express';
import {
  createCompanyCultureHero,
  getCompanyCultureHero,
  updateCompanyCultureHero,
  deleteCompanyCultureHero,
  createBrandVision,
  getBrandVision,
  updateBrandVision,
  deleteBrandVision,
  createCoreValue,
  getCoreValues,
  getCoreValueById,
  updateCoreValue,
  deleteCoreValue,
  createWorkEnvironment,
  getWorkEnvironment,
  updateWorkEnvironment,
  deleteWorkEnvironment,
  createSustainabilityCard,
  getSustainabilityCards,
  getSustainabilityCardById,
  updateSustainabilityCard,
  deleteSustainabilityCard,
  createSustainabilityCommitment,
  getSustainabilityCommitment,
  updateSustainabilityCommitment,
  deleteSustainabilityCommitment,
  createJoinTeamCTA,
  getJoinTeamCTA,
  updateJoinTeamCTA,
  deleteJoinTeamCTA,
  getAllCompanyCultureData
} from '../controllers/companyCultureController.js';
import { protect, admin } from '../middleware/index.js';

const router = express.Router();

// Company Culture Hero Routes
router.get('/hero', getCompanyCultureHero);
router.post('/hero', protect, admin, createCompanyCultureHero);
router.put('/hero/:id', protect, admin, updateCompanyCultureHero);
router.delete('/hero/:id', protect, admin, deleteCompanyCultureHero);

// Brand Vision Routes
router.get('/brand-vision', getBrandVision);
router.post('/brand-vision', protect, admin, createBrandVision);
router.put('/brand-vision/:id', protect, admin, updateBrandVision);
router.delete('/brand-vision/:id', protect, admin, deleteBrandVision);

// Core Values Routes
router.get('/core-values', getCoreValues);
router.get('/core-values/:id', getCoreValueById);
router.post('/core-values', protect, admin, createCoreValue);
router.put('/core-values/:id', protect, admin, updateCoreValue);
router.delete('/core-values/:id', protect, admin, deleteCoreValue);

// Work Environment Routes
router.get('/work-environment', getWorkEnvironment);
router.post('/work-environment', protect, admin, createWorkEnvironment);
router.put('/work-environment/:id', protect, admin, updateWorkEnvironment);
router.delete('/work-environment/:id', protect, admin, deleteWorkEnvironment);

// Sustainability Cards Routes
router.get('/sustainability-cards', getSustainabilityCards);
router.get('/sustainability-cards/:id', getSustainabilityCardById);
router.post('/sustainability-cards', protect, admin, createSustainabilityCard);
router.put('/sustainability-cards/:id', protect, admin, updateSustainabilityCard);
router.delete('/sustainability-cards/:id', protect, admin, deleteSustainabilityCard);

// Sustainability Commitment Routes
router.get('/sustainability-commitment', getSustainabilityCommitment);
router.post('/sustainability-commitment', protect, admin, createSustainabilityCommitment);
router.put('/sustainability-commitment/:id', protect, admin, updateSustainabilityCommitment);
router.delete('/sustainability-commitment/:id', protect, admin, deleteSustainabilityCommitment);

// Join Team CTA Routes
router.get('/join-team-cta', getJoinTeamCTA);
router.post('/join-team-cta', protect, admin, createJoinTeamCTA);
router.put('/join-team-cta/:id', protect, admin, updateJoinTeamCTA);
router.delete('/join-team-cta/:id', protect, admin, deleteJoinTeamCTA);

// Get all company culture data
router.get('/all', getAllCompanyCultureData);

export default router;