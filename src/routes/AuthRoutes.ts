import { Router } from 'express';
import { UserRole } from '../entities';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { roleMiddleware } from '../middlewares/RoleMiddleware';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.loginUser);
router.post('/admin/login', authController.loginAdmin);
router.get('/me', authMiddleware, authController.me);
router.get(
  '/admin/me',
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  authController.me,
);

export default router;
