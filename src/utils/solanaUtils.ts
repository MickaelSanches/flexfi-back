import { 
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
    SystemProgram
  } from '@solana/web3.js';
  import * as bs58 from 'bs58';
  import nacl from 'tweetnacl';
  
  // Connexion à Solana (configurable via variable d'environnement)
  const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
  export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
  
  // Générer une nouvelle paire de clés Solana
  export const generateKeypair = (): Keypair => {
    return Keypair.generate();
  };
  
  // Vérifier une signature
  export const verifySignature = (
    publicKey: string,
    message: string,
    signature: string
  ): boolean => {
    try {
      const publicKeyBytes = new PublicKey(publicKey).toBytes();
      const signatureBytes = bs58.decode(signature);
      const messageBytes = new TextEncoder().encode(message);
      
      return nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  };
  
  // Créer un message à signer pour prouver la propriété du wallet
  export const createVerificationMessage = (userId: string): string => {
    return `FlexFi: Sign this message to verify you own this wallet. Unique ID: ${userId}-${Date.now()}`;
  };