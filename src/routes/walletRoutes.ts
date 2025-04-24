import { Router } from 'express';
import walletController from '../controllers/walletController';
import delegationController from '../controllers/delegationController';
import { authenticate } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { 
  connectWalletValidation,
  delegationValidation
} from '../validations/walletValidations';

const router = Router();

// Protéger toutes les routes wallet
router.use(authenticate);

// Routes pour les wallets avec validation
router.post('/create', walletController.createWallet);
router.post(
  '/connect', 
  validate(connectWalletValidation),
  walletController.connectWallet
);
router.get('/', walletController.getWallets);
router.get('/verification-message', walletController.getVerificationMessage);

// Routes pour la délégation avec validation
router.post(
  '/delegate/instruction', 
  validate(delegationValidation),
  delegationController.createDelegationInstruction
);
router.post('/delegate/update-status', delegationController.updateDelegationStatus);

export default router;