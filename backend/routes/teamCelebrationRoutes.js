import express from 'express';
import {
  createTeamCelebrationHero,
  getTeamCelebrationHero,
  updateTeamCelebrationHero,
  createTeamCulture,
  getTeamCulture,
  updateTeamCulture,
  getCelebrationEvents,
  getCelebrationEvent,
  createCelebrationEvent,
  updateCelebrationEvent,
  deleteCelebrationEvent,
  getTeamAchievements,
  getTeamAchievement,
  createTeamAchievement,
  updateTeamAchievement,
  deleteTeamAchievement,
  createTeamCelebrationCTA,
  getTeamCelebrationCTA,
  updateTeamCelebrationCTA,
  getTeamCelebrationData
} from '../controllers/teamCelebrationController.js';

const router = express.Router();

// Combined data route
router.get('/', getTeamCelebrationData);

// Hero routes
router.route('/hero')
  .get(getTeamCelebrationHero)
  .post(createTeamCelebrationHero);
router.put('/hero/:id', updateTeamCelebrationHero);

// Team culture routes
router.route('/culture')
  .get(getTeamCulture)
  .post(createTeamCulture);
router.put('/culture/:id', updateTeamCulture);

// Celebration events routes
router.route('/events')
  .get(getCelebrationEvents)
  .post(createCelebrationEvent);

router.route('/events/:id')
  .get(getCelebrationEvent)
  .put(updateCelebrationEvent)
  .patch(updateCelebrationEvent)
  .delete(deleteCelebrationEvent);

// Team achievements routes
router.route('/achievements')
  .get(getTeamAchievements)
  .post(createTeamAchievement);

router.route('/achievements/:id')
  .get(getTeamAchievement)
  .put(updateTeamAchievement)
  .patch(updateTeamAchievement)
  .delete(deleteTeamAchievement);

// Team celebration CTA routes
router.route('/cta')
  .get(getTeamCelebrationCTA)
  .post(createTeamCelebrationCTA);
router.put('/cta/:id', updateTeamCelebrationCTA);

export default router;