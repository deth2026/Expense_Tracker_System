import { Router } from 'express';
import { AdminDashboardController } from '../controllers/AdminDashboardController';
import { UserRole } from '../entities';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { roleMiddleware } from '../middlewares/RoleMiddleware';

const router = Router();
const adminDashboardController = new AdminDashboardController();

router.use(authMiddleware, roleMiddleware(UserRole.ADMIN));

router.get('/', adminDashboardController.getDashboard);

export default router;
