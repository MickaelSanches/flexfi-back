import { Router } from 'express';
import kycController from '../controllers/kycController';
import kycWebhookController from '../controllers/kycWebhookController';
import { authenticate, adminOnly } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { kycWebhookValidation, submitKYCValidation } from '../validations/kycValidations';

const router = Router();

// Protéger toutes les routes KYC sauf le webhook
router.use(/^(?!\/webhook).*$/, authenticate);

// Routes pour le KYC
router.post('/submit', validate(submitKYCValidation), kycController.submitKYC);
router.get('/status', kycController.getKYCStatus);

// Webhook route - no authentication needed as it's called by Kulipa
router.post('/webhook', validate(kycWebhookValidation), kycWebhookController.kycWebhookHandler);

// Route admin pour simuler une réponse KYC
router.post('/mock-response', adminOnly, kycController.mockKulipaResponse);

export default router;