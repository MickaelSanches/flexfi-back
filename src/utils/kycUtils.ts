import crypto from 'crypto';
import config from '../config/index';

/**
 * Generate a webhook signature for Kulipa callbacks
 * @param payload The webhook payload to sign
 * @returns The generated signature
 */
export const generateWebhookSignature = (payload: any): string => {
  const webhookSecret = config.kulipa.webhookSecret;
  
  if (!webhookSecret) {
    throw new Error('Kulipa webhook secret not configured');
  }
  
  const payloadString = typeof payload === 'string' 
    ? payload 
    : JSON.stringify(payload);
  
  return crypto
    .createHmac('sha256', webhookSecret)
    .update(payloadString)
    .digest('hex');
};

/**
 * Verify the signature of a Kulipa webhook request
 * @param payload The webhook payload
 * @param signature The signature provided in the request headers
 * @returns Boolean indicating if the signature is valid
 */
export const verifyWebhookSignature = (payload: any, signature: string): boolean => {
  try {
    const computedSignature = generateWebhookSignature(payload);
    return crypto.timingSafeEqual(
      Buffer.from(computedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch (error) {
    return false;
  }
}; 