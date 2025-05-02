import { Request, Response, NextFunction } from 'express';
import { verifyWebhookSignature } from '../utils/kycUtils';
import kycService from '../services/kycService';
import logger from '../utils/logger';
import { eventEmitter, EventType } from '../utils/eventEmitter';

/**
 * Handler for KYC status update webhooks from Kulipa
 * @route POST /api/kyc/webhook
 */
export const kycWebhookHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-kulipa-signature'] as string;
    
    // Verify webhook signature
    if (!signature || !verifyWebhookSignature(req.body, signature)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }
    
    const { reference, status, verification_data } = req.body;
    
    // Update KYC based on webhook data
    const kyc = await kycService.updateKYCFromWebhook(
      reference,
      status,
      verification_data
    );
    
    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: 'KYC not found'
      });
    }
    
    // Emit event for KYC status update
    eventEmitter.emitEvent(EventType.KYC_STATUS_CHANGED, kyc.userId.toString(), { 
      status, 
      reason: verification_data?.reason,
      kycId: kyc._id.toString()
    });
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'KYC status updated successfully'
    });
  } catch (error: any) {
    logger.error('Error processing KYC webhook:', error);
    
    // Return error response but with 200 status to acknowledge receipt
    res.status(200).json({
      success: false,
      message: error.message || 'Error processing webhook'
    });
  }
};

export default { kycWebhookHandler }; 