import { Router } from 'express';
import { submitLOI, getAllLOIs, getLOIById, downloadLOI } from '../controllers/loiController';
import { loiValidation } from '../validations/loiValidation';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

// POST /api/loi - Submit a new LOI
router.post('/', loiValidation, validateRequest, submitLOI);

// GET /api/loi - Get all LOIs
router.get('/', getAllLOIs);

// GET /api/loi/:id - Get a specific LOI by ID
router.get('/:id', getLOIById);

// GET /api/loi/:id/download - Download LOI PDF
router.get('/:id/download', downloadLOI);

export default router; 