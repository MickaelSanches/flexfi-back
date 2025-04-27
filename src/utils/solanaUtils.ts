import { 
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
    SystemProgram,
    ComputeBudgetProgram
  } from '@solana/web3.js';
  import bs58 from 'bs58';
  import nacl from 'tweetnacl';
  import { AppError } from './AppError';
  import logger from './logger';
  
  // Connexion à Solana (configurable via variable d'environnement)
  const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
  export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
  
  // Générer une nouvelle paire de clés Solana
  export const generateKeypair = (): Keypair => {
    return Keypair.generate();
  };
  
  /**
   * Vérifie la signature d'un message
   * @param message Le message signé
   * @param signature La signature à vérifier
   * @param publicKey La clé publique du signataire
   * @returns true si la signature est valide, false sinon
   */
  export const verifySignature = (
    message: string,
    signature: string,
    publicKey: string
  ): boolean => {
    try {
      // Convertir les entrées en tableaux d'octets
      const messageBytes = new TextEncoder().encode(message);
      const publicKeyBytes = new PublicKey(publicKey).toBytes();
      const signatureBytes = bs58.decode(signature);

      // Vérifier la signature avec nacl
      return nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );
    } catch (error) {
      logger.error('Error verifying signature:', error);
      return false;
    }
  };
  
  // Créer un message à signer pour prouver la propriété du wallet
  export const createVerificationMessage = (userId: string): string => {
    return `FlexFi: Sign this message to verify you own this wallet. Unique ID: ${userId}-${Date.now()}`;
  };