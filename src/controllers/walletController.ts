import { Request, Response } from 'express';
import walletService from '../services/walletService';
import { verifySignature, createVerificationMessage } from '../utils/solanaUtils';
import { IUser } from '../models/User';

export class WalletController {
  // Créer un nouveau wallet
  async createWallet(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      const userId = user?._id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const wallet = await walletService.createWallet(userId.toString());
      
      res.status(201).json({
        publicKey: wallet.publicKey,
        type: wallet.type,
        hasDelegation: wallet.hasDelegation
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  // Connecter un wallet existant
  async connectWallet(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      const userId = user?._id;
      const { publicKey, signature, message } = req.body;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      if (!publicKey || !signature || !message) {
        res.status(400).json({ message: 'publicKey, signature and message are required' });
        return;
      }
      
      // Vérifier la signature
      const isValid = verifySignature(publicKey, message, signature);
      
      if (!isValid) {
        res.status(401).json({ message: 'Invalid signature' });
        return;
      }
      
      const wallet = await walletService.connectWallet(userId.toString(), publicKey);
      
      res.status(200).json({
        publicKey: wallet.publicKey,
        type: wallet.type,
        hasDelegation: wallet.hasDelegation
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  // Obtenir les wallets d'un utilisateur
  async getWallets(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      const userId = user?._id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const wallets = await walletService.getWalletsByUserId(userId.toString());
      
      // Ne pas inclure la clé privée chiffrée dans la réponse
      const walletsResponse = wallets.map(wallet => ({
        publicKey: wallet.publicKey,
        type: wallet.type,
        hasDelegation: wallet.hasDelegation,
        delegationExpiry: wallet.delegationExpiry
      }));
      
      res.status(200).json({ wallets: walletsResponse });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  // Générer un message de vérification
  async getVerificationMessage(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      const userId = user?._id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const message = createVerificationMessage(userId.toString());
      
      res.status(200).json({ message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new WalletController();