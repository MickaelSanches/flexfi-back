import { Request, Response } from 'express';
import kycService from '../services/kycService';

export class KYCController {
  // Soumettre une demande KYC
  async submitKYC(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
const userId = user?._id;
      const submissionData = req.body;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      // Valider les données requises
      const requiredFields = [
        'firstName', 'lastName', 'dateOfBirth', 'nationality', 
        'idType', 'idNumber', 'address'
      ];
      
      for (const field of requiredFields) {
        if (!submissionData[field]) {
          res.status(400).json({ message: `${field} is required` });
          return;
        }
      }
      
      const kyc = await kycService.submitKYC(userId.toString(), submissionData);
      
      res.status(201).json({
        id: kyc._id,
        status: kyc.status,
        providerReference: kyc.providerReference,
        createdAt: kyc.createdAt
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  // Obtenir le statut KYC
  async getKYCStatus(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
const userId = user?._id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const kyc = await kycService.getKYCStatus(userId.toString());
      
      if (!kyc) {
        res.status(404).json({ message: 'KYC not found' });
        return;
      }
      
      res.status(200).json({
        id: kyc._id,
        status: kyc.status,
        providerReference: kyc.providerReference,
        createdAt: kyc.createdAt,
        updatedAt: kyc.updatedAt
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  // [ADMIN ONLY] Mock KYC response
  async mockKulipaResponse(req: Request, res: Response): Promise<void> {
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
  }
}

export default new KYCController();