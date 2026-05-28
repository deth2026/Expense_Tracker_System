import { Router } from 'express';
import adminRoutes from './AdminRoutes';
import authRoutes from './AuthRoutes';
import incomeRoutes from './IncomeRoutes';
import userRoutes from './UserRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/incomes', incomeRoutes);

export default router;
