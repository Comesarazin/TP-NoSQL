import { Router } from 'express';
import * as profileController from './controller';

const router = Router();

// Routes principales pour les profils
router.get('/', profileController.getAllProfiles);
router.get('/:id', profileController.getProfileById);
router.post('/', profileController.createProfile);
router.put('/:id', profileController.updateProfile);
router.delete('/:id', profileController.deleteProfile);

// Routes pour les expériences
router.post('/:id/experience', profileController.addExperience);
router.delete('/:id/experience/:exp', profileController.deleteExperience);

// Routes pour les compétences
router.post('/:id/skills', profileController.addSkill);
router.delete('/:id/skills/:skill', profileController.deleteSkill);

// Route pour les informations
router.put('/:id/information', profileController.updateInformation);

// Routes bonus pour les amis
router.post('/:id/friends', profileController.addFriend);
router.delete('/:id/friends/:friendId', profileController.removeFriend);
router.get('/:id/friends', profileController.getFriends);

export default router;