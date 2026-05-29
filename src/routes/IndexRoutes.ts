import { Router } from 'express';
import adminRoutes from './AdminRoutes';
import authRoutes from './AuthRoutes';
<<<<<<< HEAD
import incomeRoutes from './IncomeRoutes';
import userRoutes from './UserRoutes';
=======
import categoryRoutes from './CategoryRoutes';
>>>>>>> 49bbb580ebb2956b978d05351294acd0b0100284

const router = Router();

router.use('/auth', authRoutes);
<<<<<<< HEAD
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/incomes', incomeRoutes);
=======
router.use('/categories', categoryRoutes);
>>>>>>> 49bbb580ebb2956b978d05351294acd0b0100284

export default router;
