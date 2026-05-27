import { Router } from 'express';
import { UserRole } from '../entities';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { roleMiddleware } from '../middlewares/RoleMiddleware';

const router = Router();
const userController = new UserController();

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.delete('/profile', userController.deleteProfile);

router.get('/', roleMiddleware(UserRole.ADMIN), userController.listUsers);
router.get('/:id', roleMiddleware(UserRole.ADMIN), userController.getUserById);

export default router;
