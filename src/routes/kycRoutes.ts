import { Router } from 'express';
import kycController from '../controllers/kycController';
import { authenticate, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

// Protéger toutes les routes KYC
router.use(authenticate);

// Routes pour le KYC
router.post('/submit', kycController.submitKYC);
router.get('/status', kycController.getKYCStatus);

// Route admin pour simuler une réponse KYC
router.post('/mock-response', adminOnly, kycController.mockKulipaResponse);

export default router;