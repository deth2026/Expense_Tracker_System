import { Router } from 'express';
import adminRoutes from './AdminRoutes';
import authRoutes from './AuthRoutes';
import categoryRoutes from './CategoryRoutes';
import expenseRoutes from './ExpenseRoutes';
import incomeRoutes from './IncomeRoutes';
import userRoutes from './UserRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/expenses', expenseRoutes);
router.use('/users', userRoutes);
router.use('/incomes', incomeRoutes);

export default router;
