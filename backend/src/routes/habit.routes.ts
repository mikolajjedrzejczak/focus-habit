import { Router } from 'express';
import * as habitController from '../controllers/habit.controller.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createHabitSchema } from '../validators/habit.validator.js';

const router = Router();

router.use(authenticateJwt);

router.post('/', validate(createHabitSchema), habitController.createHabit);
router.post('/:id/toggle', habitController.toggleHabit);
router.delete('/:id', habitController.deleteHabit);

export default router;
