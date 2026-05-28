import { Router } from 'express';
import { BudgetController } from '../controllers/BudgetController';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();
const budgetController = new BudgetController();

router.get('/', authMiddleware, budgetController.list);
router.get('/:id', authMiddleware, budgetController.getById);
router.post('/', authMiddleware, budgetController.create);
router.put('/:id', authMiddleware, budgetController.update);
router.delete('/:id', authMiddleware, budgetController.delete);

export default router;
