import { Request, Response } from 'express';
import { kycWebhookHandler } from '../../../controllers/kycWebhookController';
import { eventEmitter, EventType } from '../../../utils/eventEmitter';
import * as kycUtils from '../../../utils/kycUtils';
import mongoose from 'mongoose';

// Mock dependencies
jest.mock('../../../services/kycService', () => ({
  __esModule: true,
  default: {
    updateKYCFromWebhook: jest.fn(),
    submitKYC: jest.fn(),
    getKYCStatus: jest.fn(),
    updateKYCStatus: jest.fn(),
    mockKulipaResponse: jest.fn(),
    hasApprovedKYC: jest.fn()
  }
}));
jest.mock('../../../utils/eventEmitter');
jest.mock('../../../utils/kycUtils');
jest.mock('../../../utils/logger');

// Import after mocking
import kycService from '../../../services/kycService';

describe('KYC Webhook Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        reference: 'KULIPA-123456789',
        status: 'approved',
        verification_data: {
          fullName: 'John Doe',
          documentNumber: 'AB123456',
          verifiedAt: '2023-01-01T12:00:00Z'
        }
      },
      headers: {
        'x-kulipa-signature': 'mock-signature'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should process a valid KYC approval webhook', async () => {
    // Mock signature verification
    jest.spyOn(kycUtils, 'verifyWebhookSignature').mockReturnValue(true);
    
    // Mock KYC service response
    const mockKyc = {
      _id: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      status: 'approved',
      providerReference: 'KULIPA-123456789',
      responseData: req.body.verification_data
    };
    
    (kycService.updateKYCFromWebhook as jest.Mock).mockResolvedValue(mockKyc);
    
    await kycWebhookHandler(req as Request, res as Response, next);
    
    // Verify the response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'KYC status updated successfully'
    });
    
    // Verify the service was called
    expect(kycService.updateKYCFromWebhook).toHaveBeenCalledWith(
      'KULIPA-123456789',
      'approved',
      req.body.verification_data
    );
    
    // Verify event was emitted
    expect(eventEmitter.emitEvent).toHaveBeenCalledWith(
      EventType.KYC_STATUS_CHANGED,
      mockKyc.userId.toString(),
      expect.objectContaining({
        status: 'approved',
        kycId: mockKyc._id.toString()
      })
    );
  });

  it('should return 401 for invalid signature', async () => {
    // Mock invalid signature
    jest.spyOn(kycUtils, 'verifyWebhookSignature').mockReturnValue(false);
    
    await kycWebhookHandler(req as Request, res as Response, next);
    
    // Verify the response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid webhook signature'
    });
    
    // Verify service not called
    expect(kycService.updateKYCFromWebhook).not.toHaveBeenCalled();
    expect(eventEmitter.emitEvent).not.toHaveBeenCalled();
  });

  it('should handle KYC not found error', async () => {
    // Mock signature verification
    jest.spyOn(kycUtils, 'verifyWebhookSignature').mockReturnValue(true);
    
    // Mock KYC service returning null (KYC not found)
    (kycService.updateKYCFromWebhook as jest.Mock).mockResolvedValue(null);
    
    await kycWebhookHandler(req as Request, res as Response, next);
    
    // Verify the response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'KYC not found'
    });
    
    // Verify event not emitted
    expect(eventEmitter.emitEvent).not.toHaveBeenCalled();
  });

  it('should handle service errors gracefully with 200 response', async () => {
    // Mock signature verification
    jest.spyOn(kycUtils, 'verifyWebhookSignature').mockReturnValue(true);
    
    // Mock KYC service throwing an error
    const errorMessage = 'Service error';
    (kycService.updateKYCFromWebhook as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    await kycWebhookHandler(req as Request, res as Response, next);
    
    // Verify we still respond with 200 but error message
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: errorMessage
    });
    
    // Verify event not emitted
    expect(eventEmitter.emitEvent).not.toHaveBeenCalled();
  });
}); 