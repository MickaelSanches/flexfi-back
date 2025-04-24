// src/services/delegationService.ts
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  TransactionInstruction,
  sendAndConfirmTransaction,
  Keypair
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  createApproveInstruction,
  createTransferInstruction,
  getAccount
} from '@solana/spl-token';
import { solanaConfig } from '../config/solana';
import bs58 from 'bs58';
import walletService from './walletService';

export class DelegationService {
  private connection: Connection;
  private delegatePubkey: PublicKey;
  private delegateKeypair: Keypair | null = null;
  
  constructor() {
    this.connection = new Connection(solanaConfig.rpcUrl, 'confirmed');
    this.delegatePubkey = new PublicKey(solanaConfig.delegatePublicKey);
    
    // Initialiser le keypair de délégation si la clé privée est disponible et semble valide
    if (solanaConfig.delegatePrivateKey && 
        solanaConfig.delegatePrivateKey !== 'your-delegate-private-key') {
      try {
        const privateKeyBytes = bs58.decode(solanaConfig.delegatePrivateKey);
        this.delegateKeypair = Keypair.fromSecretKey(privateKeyBytes);
      } catch (error) {
        console.warn('Invalid delegate private key format. Delegation service will be limited.');
      }
    }
  }
  
  // Créer une instruction de délégation pour un token
  async createDelegationInstruction(
    userPublicKey: string,
    tokenAccount: string,
    amount: number
  ): Promise<Transaction> {
    try {
      const userPubkey = new PublicKey(userPublicKey);
      const tokenAccountPubkey = new PublicKey(tokenAccount);
      
      // Créer une transaction pour approuver la délégation sur un token
      const transaction = new Transaction().add(
        createApproveInstruction(
          tokenAccountPubkey,
          this.delegatePubkey,
          userPubkey,   // propriétaire du compte
          amount        // montant maximum autorisé
        )
      );
      
      // Récupérer le dernier blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = userPubkey;
      
      return transaction;
    } catch (error) {
      console.error('Error creating delegation instruction:', error);
      throw error;
    }
  }
  
  // Exécuter une transaction avec l'autorité déléguée
  async executeWithDelegatedAuthority(
    tokenAccount: string,
    destination: string,
    amount: number
  ): Promise<string> {
    try {
      if (!this.delegateKeypair) {
        throw new Error('Delegate private key not available');
      }
      
      const tokenAccountPubkey = new PublicKey(tokenAccount);
      const destinationPubkey = new PublicKey(destination);
      
      // Créer la transaction qui sera exécutée avec l'autorité déléguée
      const transaction = new Transaction().add(
        createTransferInstruction(
          tokenAccountPubkey,
          destinationPubkey,
          this.delegatePubkey, // En tant que délégué autorisé
          amount
        )
      );
      
      // Récupérer le dernier blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.delegatePubkey;
      
      // Signer et envoyer la transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.delegateKeypair], // Le service signe la transaction
        { commitment: 'confirmed' }
      );
      
      return signature;
    } catch (error) {
      console.error('Error executing with delegated authority:', error);
      throw error;
    }
  }
  
  // Vérifier si le service a l'autorisation déléguée pour un compte
  async checkDelegatedAuthority(
    tokenAccount: string
  ): Promise<boolean> {
    try {
      const tokenAccountPubkey = new PublicKey(tokenAccount);
      
      // Récupérer les informations sur le compte token
      const accountInfo = await getAccount(
        this.connection,
        tokenAccountPubkey
      );
      
      // Vérifier si le délégué est notre service
      if (accountInfo.delegate) {
        return accountInfo.delegate.equals(this.delegatePubkey);
      }
      
      return false;
    } catch (error) {
      console.error('Error checking delegated authority:', error);
      return false;
    }
  }
  
  // Mettre à jour le statut de délégation dans la base de données
  async updateDelegationStatus(
    userId: string,
    publicKey: string,
    tokenAccount: string
  ): Promise<boolean> {
    try {
      // Vérifier si la délégation existe sur la blockchain
      const hasDelegation = await this.checkDelegatedAuthority(tokenAccount);
      
      // Si la délégation existe, mettre à jour le statut dans la base de données
      if (hasDelegation) {
        // Délégation valide pour 90 jours
        const delegationExpiry = new Date();
        delegationExpiry.setDate(delegationExpiry.getDate() + 90);
        
        await walletService.updateDelegationStatus(
          publicKey,
          true,
          delegationExpiry
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating delegation status:', error);
      throw error;
    }
  }
}

export default new DelegationService();