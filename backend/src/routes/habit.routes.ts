import { Router } from 'express';
import * as habitController from '../controllers/habit.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createHabitSchema } from '../validators/habit.validator';

const router = Router();

router.use(authenticateJwt);

router.post('/', validate(createHabitSchema), habitController.createHabit);
router.post('/:id/toggle', habitController.toggleHabit);
router.delete('/:id', habitController.deleteHabit);

export default router;
