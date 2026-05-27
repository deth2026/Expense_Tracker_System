import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserRole } from '../entities';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { roleMiddleware } from '../middlewares/RoleMiddleware';

const router = Router();
const userController = new UserController();

router.use(authMiddleware, roleMiddleware(UserRole.ADMIN));

router.get('/profile', userController.getProfile);

export default router;
