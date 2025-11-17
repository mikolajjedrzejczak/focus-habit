import { Router } from 'express';
import { authenticateJwt } from '../middleware/auth.middleware.js';
import * as listController from '../controllers/habitList.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  createListSchema,
  updateListSchema,
} from '../validators/habitList.validator.js';

const router = Router();

router.use(authenticateJwt);

router.get('/', listController.getAllList);
router.post('/', validate(createListSchema), listController.createList);
router.put('/:id', validate(updateListSchema), listController.updateList);
router.delete('/:id', listController.deleteList);

export default router;
