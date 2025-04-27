import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import * as kycServiceModule from '../services/kycService';
import { KYCService } from '../services/serviceInterfaces';
import logger from '../utils/logger';
import { eventEmitter, EventType } from '../utils/eventEmitter';
import { getUserIdFromRequest } from '../utils/requestUtils';

// Cast imported service to interface
const kycService = kycServiceModule as unknown as KYCService;

/**
 * Soumettre une demande KYC
 * @route POST /api/kyc/submit
 */
export const submitKYC = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    // Extraire les données du corps de la requête
    const { firstName, lastName, dateOfBirth, address, documentType, documentImage } = req.body;

    // Vérifier que toutes les données requises sont présentes
    if (!firstName || !lastName || !dateOfBirth || !address || !documentType || !documentImage) {
      return next(new AppError('All fields are required', 400));
    }

    // Traiter la soumission KYC
    const kyc = await kycService.submitKYC(
      userId,
      { firstName, lastName, dateOfBirth, address, documentType, documentImage }
    );

    // Emit event for KYC submission
    eventEmitter.emitEvent(EventType.KYC_SUBMITTED, userId, { kycId: kyc._id.toString() });

    // Répondre avec succès
    res.status(201).json({
      success: true,
      data: {
        kyc
      },
      message: 'KYC submitted successfully and is pending review'
    });
  } catch (error) {
    logger.error('Error submitting KYC:', error);
    next(error);
  }
};

/**
 * Récupérer le statut KYC
 * @route GET /api/kyc/status
 */
export const getKYCStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const kycStatus = await kycService.getKYCStatus(userId);

    res.status(200).json({
      success: true,
      data: {
        status: kycStatus
      }
    });
  } catch (error) {
    logger.error('Error getting KYC status:', error);
    next(error);
  }
};

/**
 * Mettre à jour le statut KYC (réservé aux admins)
 * @route PUT /api/kyc/:kycId/status
 */
export const updateKYCStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Vérifier que l'utilisateur est un admin (à implémenter)
    
    const { kycId } = req.params;
    const { status, reason } = req.body;
    
    if (!kycId || !status || !['approved', 'rejected'].includes(status)) {
      return next(new AppError('Invalid request data', 400));
    }
    
    const kyc = await kycService.updateKYCStatus(kycId, status, reason);
    
    // Emit event for KYC status update
    eventEmitter.emitEvent(EventType.KYC_STATUS_CHANGED, kyc.userId.toString(), { 
      status, 
      reason,
      kycId
    });
    
    res.status(200).json({
      success: true,
      data: {
        kyc
      },
      message: `KYC status updated to ${status}`
    });
  } catch (error) {
    logger.error('Error updating KYC status:', error);
    next(error);
  }
};

// [ADMIN ONLY] Mock KYC response
export const mockKulipaResponse = async (req: Request, res: Response): Promise<void> => {
  try {
    // Cette route devrait être protégée par un middleware admin
    const { kycId, status, responseData } = req.body;
    
    if (!kycId || !status) {
      res.status(400).json({ message: 'kycId and status are required' });
      return;
    }
    
    if (status !== 'approved' && status !== 'rejected') {
      res.status(400).json({ message: 'status must be "approved" or "rejected"' });
      return;
    }
    
    const kyc = await kycService.mockKulipaResponse(kycId, status, responseData);
    
    if (!kyc) {
      res.status(404).json({ message: 'KYC not found' });
      return;
    }
    
    res.status(200).json({
      id: kyc._id,
      status: kyc.status,
      providerReference: kyc.providerReference,
      responseData: kyc.responseData,
      updatedAt: kyc.updatedAt
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export default { submitKYC, getKYCStatus, updateKYCStatus, mockKulipaResponse };