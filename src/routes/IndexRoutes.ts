import { Router } from 'express';
import authRoutes from './AuthRoutes';

const router = Router();

router.use('/auth', authRoutes);

export default router;
