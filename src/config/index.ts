import env from './env';
import kycConfig from './kyc';
import { authConfig } from './auth';
import { solanaConfig } from './solana';

const config = {
  env,
  ...kycConfig,
  auth: authConfig,
  solana: solanaConfig,
};

export default config; 