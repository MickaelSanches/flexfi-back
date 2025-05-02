import env from './env';
import { str } from 'envalid';

// Validate KYC-specific environment variables
const kycEnv = {
  KULIPA_API_KEY: process.env.KULIPA_API_KEY || '',
  KULIPA_API_URL: process.env.KULIPA_API_URL || 'https://api.kulipa.io',
  KULIPA_WEBHOOK_SECRET: process.env.KULIPA_WEBHOOK_SECRET || '',
};

// KYC configuration
const kycConfig = {
  kulipa: {
    apiKey: kycEnv.KULIPA_API_KEY,
    apiUrl: kycEnv.KULIPA_API_URL,
    webhookSecret: kycEnv.KULIPA_WEBHOOK_SECRET
  }
};

export default kycConfig; 