import { Request, Response } from 'express';
import delegationService from '../services/delegationService';
import walletService from '../services/walletService';

export class DelegationController {
  // Créer une instruction de délégation
  async createDelegationInstruction(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
const userId = user?._id;
      const { publicKey, tokenAccount, amount } = req.body;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      if (!publicKey || !tokenAccount || !amount) {
        res.status(400).json({ message: 'publicKey, tokenAccount and amount are required' });
        return;
      }
      
      // Vérifier que le wallet appartient à l'utilisateur
      const wallet = await walletService.getWalletByPublicKey(publicKey);
      if (!wallet || wallet.userId.toString() !== userId.toString()) {
        res.status(403).json({ message: 'Wallet not found or not owned by user' });
        return;
      }
      
      const transaction = await delegationService.createDelegationInstruction(
        publicKey,
        tokenAccount,
        amount
      );
      
      // Convertir la transaction en un format qui peut être sérialisé en JSON
      const serializedTransaction = Buffer.from(
        transaction.serialize({ requireAllSignatures: false })
      ).toString('base64');
      
      res.status(200).json({
        transaction: serializedTransaction,
        message: 'Sign this transaction to delegate authority to FlexFi'
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  // Mettre à jour le statut de délégation
  async updateDelegationStatus(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
const userId = user?._id;
      const { publicKey, tokenAccount } = req.body;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      if (!publicKey || !tokenAccount) {
        res.status(400).json({ message: 'publicKey and tokenAccount are required' });
        return;
      }
      
      // Vérifier que le wallet appartient à l'utilisateur
      const wallet = await walletService.getWalletByPublicKey(publicKey);
      if (!wallet || wallet.userId.toString() !== userId.toString()) {
        res.status(403).json({ message: 'Wallet not found or not owned by user' });
        return;
      }
      
      const hasDelegation = await delegationService.updateDelegationStatus(
        userId.toString(),
        publicKey,
        tokenAccount
      );
      
      res.status(200).json({
        publicKey,
        hasDelegation,
        message: hasDelegation 
          ? 'Delegation successfully verified and updated' 
          : 'No valid delegation found'
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new DelegationController();