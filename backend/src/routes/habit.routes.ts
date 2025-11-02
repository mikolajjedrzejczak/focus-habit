import { Router } from 'express';
import * as habitController from '../controllers/habit.controller.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJwt);

router.get('/', habitController.getAllUserHabits);
router.post('/', habitController.createNewHabit);
router.delete('/:id', habitController.deleteHabit);

export default router;
