import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateJwt, (req, res) => {

  const user = req.user as { id: string; email: string };

  res.status(200).json({
    id: user.id,
    email: user.email,
  });
});

export default router;
