import { Router } from 'express';
import authRoutes from './authRoutes';
import walletRoutes from './walletRoutes';
import kycRoutes from './kycRoutes';
import cardRoutes from './cardRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/wallet', walletRoutes);
router.use('/kyc', kycRoutes);
router.use('/card', cardRoutes);

export default router;