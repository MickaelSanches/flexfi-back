import KYC, { IKYC } from '../models/KYC';
import userService from './userService';

// Interface pour les données KYC
interface KYCSubmissionData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  idType: 'passport' | 'national_id' | 'drivers_license';
  idNumber: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  // Autres champs selon les besoins
}

export class KYCService {
  // Soumettre une demande KYC
  async submitKYC(
    userId: string,
    submissionData: KYCSubmissionData
  ): Promise<IKYC> {
    try {
      // Vérifier si l'utilisateur a déjà soumis une demande KYC
      const existingKYC = await KYC.findOne({ userId });
      if (existingKYC) {
        throw new Error('KYC verification already submitted');
      }
      
      // En production, vous appelleriez ici l'API de Kulipa
      // Pour le mock, on génère une référence aléatoire
      const providerReference = `KULIPA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Créer une nouvelle entrée KYC
      const kyc = new KYC({
        userId,
        status: 'pending',
        providerReference,
        submissionData,
        responseData: null
      });
      
      await kyc.save();
      
      // Mettre à jour le statut KYC de l'utilisateur
      await userService.updateKYCStatus(userId, 'pending', kyc._id.toString());
      
      return kyc;
    } catch (error) {
      throw error;
    }
  }
  
  // Vérifier le statut KYC
  async getKYCStatus(userId: string): Promise<IKYC | null> {
    try {
      return await KYC.findOne({ userId });
    } catch (error) {
      throw error;
    }
  }
  
  // Simuler une réponse de l'API Kulipa (pour le développement)
  async mockKulipaResponse(
    kycId: string,
    status: 'approved' | 'rejected',
    responseData: any = {}
  ): Promise<IKYC | null> {
    try {
      const kyc = await KYC.findByIdAndUpdate(
        kycId,
        {
          status,
          responseData
        },
        { new: true }
      );
      
      if (kyc) {
        // Mettre à jour le statut KYC de l'utilisateur
        await userService.updateKYCStatus(kyc.userId.toString(), status);
      }
      
      return kyc;
    } catch (error) {
      throw error;
    }
  }
  
  // Traiter les mises à jour de statut KYC provenant du webhook Kulipa
  async updateKYCFromWebhook(
    providerReference: string,
    status: 'approved' | 'rejected',
    responseData: any = {}
  ): Promise<IKYC | null> {
    try {
      // Trouver le KYC par sa référence provider
      const kyc = await KYC.findOne({ providerReference });
      
      if (!kyc) {
        throw new Error(`KYC with reference ${providerReference} not found`);
      }
      
      // Mettre à jour le KYC
      kyc.status = status;
      kyc.responseData = responseData;
      await kyc.save();
      
      // Mettre à jour le statut KYC de l'utilisateur
      await userService.updateKYCStatus(kyc.userId.toString(), status);
      
      return kyc;
    } catch (error) {
      throw error;
    }
  }
  
  // Vérifier si un utilisateur a passé le KYC avec succès
  async hasApprovedKYC(userId: string): Promise<boolean> {
    try {
      const kyc = await KYC.findOne({ userId });
      return kyc?.status === 'approved';
    } catch (error) {
      return false;
    }
  }
}

export default new KYCService();