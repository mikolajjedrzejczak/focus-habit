import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

router.get('/me', authenticateJwt, (req, res) => {
  const user = req.user as { id: string; email: string };

  res.status(200).json({
    id: user.id,
    email: user.email,
  });
});

export default router;
