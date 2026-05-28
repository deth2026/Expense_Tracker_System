import { Router } from 'express';
import authRoutes from './AuthRoutes';
import budgetRoutes from './BudgetRoutes';
import categoryRoutes from './CategoryRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/budgets', budgetRoutes);
router.use('/categories', categoryRoutes);

export default router;
