import { authConfig } from "./auth";
import { brevoConfig } from "./brevo";
import env from "./env";
import kycConfig from "./kyc";
import { solanaConfig } from "./solana";

const config = {
  env,
  ...kycConfig,
  auth: authConfig,
  solana: solanaConfig,
  brevo: brevoConfig,
};

export default config;
