import { Router } from 'express';
import { UserRole } from '../entities';
import { CategoryController } from '../controllers/CategoryController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { roleMiddleware } from '../middlewares/RoleMiddleware';

const router = Router();
const categoryController = new CategoryController();

router.get('/', authMiddleware, categoryController.list);
router.get('/:id', authMiddleware, categoryController.getById);
router.post('/', authMiddleware, roleMiddleware(UserRole.ADMIN), categoryController.create);
router.put('/:id', authMiddleware, roleMiddleware(UserRole.ADMIN), categoryController.update);
router.delete('/:id', authMiddleware, roleMiddleware(UserRole.ADMIN), categoryController.delete);

export default router;
