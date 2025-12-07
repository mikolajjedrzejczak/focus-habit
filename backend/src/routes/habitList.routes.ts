import { Router } from 'express';
import { authenticateJwt } from '../middleware/auth.middleware';
import * as listController from '../controllers/habitList.controller';
import { validate } from '../middleware/validation.middleware';
import {
  createListSchema,
  updateListSchema,
} from '../validators/habitList.validator';

const router = Router();

router.use(authenticateJwt);

router.get('/', listController.getAllList);
router.post('/', validate(createListSchema), listController.createList);
router.put('/:id', validate(updateListSchema), listController.updateList);
router.delete('/:id', listController.deleteList);

export default router;
