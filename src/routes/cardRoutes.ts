import { Router } from 'express';
import cardController from '../controllers/cardController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Protéger toutes les routes de carte
router.use(authenticate);

// Routes pour les cartes
router.post('/select', cardController.selectCard);
router.get('/', cardController.getCard);
router.post('/:cardId/activate', cardController.activateCard);
router.post('/:cardId/block', cardController.blockCard);

export default router;