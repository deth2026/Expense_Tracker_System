import { Router } from 'express';
import authRoutes from './AuthRoutes';
import categoryRoutes from './CategoryRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);

export default router;
