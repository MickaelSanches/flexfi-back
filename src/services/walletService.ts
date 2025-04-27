import { Keypair, PublicKey } from '@solana/web3.js';
import Wallet, { IWallet } from '../models/Wallet';
import userService from './userService';
import { generateKeypair } from '../utils/solanaUtils';
import { encryptPrivateKey, decryptPrivateKey } from '../utils/encryption';

export class WalletService {
  // Créer un nouveau wallet pour un utilisateur
  async createWallet(userId: string, mnemonic?: string): Promise<IWallet> {
    try {
      // Générer un nouveau keypair Solana
      const keypair = generateKeypair();
      const publicKey = keypair.publicKey.toString();
      const privateKeyBytes = keypair.secretKey;
      
      // Convertir la clé privée en format lisible
      const privateKeyStr = Buffer.from(privateKeyBytes).toString('hex');
      
      // Chiffrer la clé privée
      const { encryptedData, iv, authTag } = encryptPrivateKey(privateKeyStr, userId);
      
      // Format pour stocker dans MongoDB
      const encryptedPrivateKey = JSON.stringify({ 
        data: encryptedData, 
        iv, 
        authTag 
      });
      
      // Créer le wallet dans la base de données
      const wallet = new Wallet({
        userId,
        publicKey,
        encryptedPrivateKey,
        type: 'created',
        hasDelegation: false
      });
      
      await wallet.save();
      
      // Ajouter le wallet à l'utilisateur
      await userService.addWalletToUser(userId, publicKey, 'created');
      
      return wallet;
    } catch (error) {
      throw error;
    }
  }
  
  // Associer un wallet existant à un utilisateur
  async connectWallet(
    userId: string,
    publicKey: string
  ): Promise<IWallet> {
    try {
      // Vérifier si le wallet existe déjà
      const existingWallet = await Wallet.findOne({ publicKey });
      if (existingWallet) {
        throw new Error('Wallet already connected to an account');
      }
      
      // Créer le wallet dans la base de données
      const wallet = new Wallet({
        userId,
        publicKey,
        type: 'connected',
        hasDelegation: false
      });
      
      await wallet.save();
      
      // Ajouter le wallet à l'utilisateur
      await userService.addWalletToUser(userId, publicKey, 'connected');
      
      return wallet;
    } catch (error) {
      throw error;
    }
  }
  
  // Récupérer les wallets d'un utilisateur
  async getUserWallets(userId: string): Promise<IWallet[]> {
    try {
      return await Wallet.find({ userId });
    } catch (error) {
      throw error;
    }
  }
  
  // Récupérer un wallet par son adresse publique
  async getWalletByPublicKey(publicKey: string): Promise<IWallet | null> {
    try {
      return await Wallet.findOne({ publicKey });
    } catch (error) {
      throw error;
    }
  }
  
  // Mettre à jour le statut de délégation d'un wallet
  async updateDelegationStatus(
    publicKey: string,
    hasDelegation: boolean,
    delegationExpiry?: Date
  ): Promise<IWallet | null> {
    try {
      const wallet = await Wallet.findOneAndUpdate(
        { publicKey },
        {
          hasDelegation,
          delegationExpiry
        },
        { new: true }
      );
      
      if (wallet) {
        // Mettre à jour également le statut dans le document utilisateur
        await userService.updateWalletDelegation(
          wallet.userId.toString(),
          publicKey,
          hasDelegation,
          delegationExpiry
        );
      }
      
      return wallet;
    } catch (error) {
      throw error;
    }
  }
  
  // Récupérer la clé privée déchiffrée (uniquement pour les wallets créés)
  async getDecryptedPrivateKey(publicKey: string, userId: string): Promise<string> {
    try {
      const wallet = await Wallet.findOne({ 
        publicKey,
        userId,
        type: 'created'
      });
      
      if (!wallet || !wallet.encryptedPrivateKey) {
        throw new Error('No private key available for this wallet');
      }
      
      const { data, iv, authTag } = JSON.parse(wallet.encryptedPrivateKey);
      
      return decryptPrivateKey(data, iv, authTag, userId.toString());
    } catch (error) {
      throw error;
    }
  }
}

export default new WalletService();