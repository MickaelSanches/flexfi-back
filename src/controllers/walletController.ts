import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import walletService from '../services/walletService';
import { WalletService } from '../services/serviceInterfaces';
import { verifySignature, createVerificationMessage } from '../utils/solanaUtils';
import logger from '../utils/logger';
import { eventEmitter, EventType } from '../utils/eventEmitter';
import { getUserIdFromRequest } from '../utils/requestUtils';

// Cast imported service to interface
const walletServiceInterface = walletService as unknown as WalletService;

/**
 * Create a new wallet for the user
 * @route POST /api/wallet/create
 */
export const createWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);
    
    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }
    
    // Optional mnemonic if user wants to import an existing wallet
    const { mnemonic } = req.body;
    
    const wallet = await walletServiceInterface.createWallet(userId, mnemonic);
    
    // Emit wallet created event
    eventEmitter.emitEvent(EventType.WALLET_CREATED, userId, {
      walletId: wallet.publicKey
    });
    
    res.status(201).json({
      success: true,
      data: {
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey, // Will be shown only once to the user
        type: 'created'
      },
      message: 'Wallet created successfully'
    });
  } catch (error) {
    logger.error('Error creating wallet:', error);
    next(error);
  }
};

/**
 * Connect an existing wallet
 * @route POST /api/wallet/connect
 */
export const connectWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);
    
    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }
    
    const { publicKey, signature, message } = req.body;
    
    // Verify signature
    const isValid = verifySignature(message, signature, publicKey);
    
    if (!isValid) {
      return next(new AppError('Invalid signature', 400));
    }
    
    // Connect wallet
    const wallet = await walletServiceInterface.connectWallet(userId, publicKey);
    
    // Emit wallet connected event
    eventEmitter.emitEvent(EventType.WALLET_CONNECTED, userId, {
      walletId: wallet.publicKey
    });
    
    res.status(200).json({
      success: true,
      data: {
        publicKey: wallet.publicKey,
        type: 'connected'
      },
      message: 'Wallet connected successfully'
    });
  } catch (error) {
    logger.error('Error connecting wallet:', error);
    next(error);
  }
};

/**
 * Get the user's wallets
 * @route GET /api/wallet
 */
export const getWallets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);
    
    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }
    
    const wallets = await walletServiceInterface.getUserWallets(userId);
    
    res.status(200).json({
      success: true,
      data: wallets,
      message: 'Wallets retrieved successfully'
    });
  } catch (error) {
    logger.error('Error getting wallets:', error);
    next(error);
  }
};

/**
 * Generate a verification message
 * @route GET /api/wallet/verification-message
 */
export const getVerificationMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);
    
    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }
    
    const message = createVerificationMessage(userId);
    
    res.status(200).json({
      success: true,
      data: {
        message
      }
    });
  } catch (error) {
    logger.error('Error generating verification message:', error);
    next(error);
  }
};

export default {
  createWallet,
  connectWallet,
  getWallets,
  getVerificationMessage
};