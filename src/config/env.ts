import dotenv from 'dotenv';
import { cleanEnv, str, port, url } from 'envalid';

// Charger les variables d'environnement
dotenv.config();

// Valider les variables d'environnement
const env = cleanEnv(process.env, {
  // Server
  PORT: port({ default: 3000 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  
  // MongoDB
  MONGODB_URI: url(),
  
  // Authentication
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '7d' }),
  
  // Encryption
  ENCRYPTION_KEY: str(),
  
  // Solana
  SOLANA_RPC_URL: url({ default: 'https://api.devnet.solana.com' }),
  SOLANA_NETWORK: str({ choices: ['devnet', 'testnet', 'mainnet-beta'], default: 'devnet' }),
  FLEXFI_DELEGATE_PUBKEY: str({ default: '' }),
  FLEXFI_DELEGATE_PRIVATE_KEY: str({ default: '' }),
  
  // OAuth (optionnels pour le développement)
  GOOGLE_CLIENT_ID: str({ default: '' }),
  GOOGLE_CLIENT_SECRET: str({ default: '' }),
  GOOGLE_CALLBACK_URL: str({ default: 'http://localhost:3000/api/auth/google/callback' }),
  
  APPLE_CLIENT_ID: str({ default: '' }),
  APPLE_TEAM_ID: str({ default: '' }),
  APPLE_KEY_ID: str({ default: '' }),
  APPLE_PRIVATE_KEY_LOCATION: str({ default: '' }),
  APPLE_CALLBACK_URL: str({ default: 'http://localhost:3000/api/auth/apple/callback' }),
  
  TWITTER_CONSUMER_KEY: str({ default: '' }),
  TWITTER_CONSUMER_SECRET: str({ default: '' }),
  TWITTER_CALLBACK_URL: str({ default: 'http://localhost:3000/api/auth/twitter/callback' }),
});

export default env;