import crypto from 'crypto';
import { zealyConfig } from '../config/zealy';
import logger from './logger';

/**
 * Generates a state parameter for OAuth flow with expiration
 * @param userId User ID to include in the state
 * @returns Encoded state string
 */
export const generateOAuthState = (userId: string): string => {
  const expiresAt = Date.now() + zealyConfig.security.stateExpiration;
  const stateData = {
    userId,
    expiresAt
  };
  
  // Create a string to sign
  const dataString = JSON.stringify(stateData);
  
  // Create a signature
  const hmac = crypto.createHmac('sha256', zealyConfig.clientSecret);
  hmac.update(dataString);
  const signature = hmac.digest('hex');
  
  // Combine data and signature
  const state = Buffer.from(JSON.stringify({
    data: dataString,
    signature
  })).toString('base64');
  
  return state;
};

/**
 * Verifies the state parameter from OAuth callback
 * @param state The state parameter from the callback
 * @returns The user ID if valid, null if invalid
 */
export const verifyOAuthState = (state: string): string | null => {
  try {
    // Decode state
    const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
    const { data, signature } = decodedState;
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', zealyConfig.clientSecret);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');
    
    if (signature !== expectedSignature) {
      logger.warn('Invalid OAuth state signature');
      return null;
    }
    
    // Parse data
    const stateData = JSON.parse(data);
    const { userId, expiresAt } = stateData;
    
    // Check expiration
    if (Date.now() > expiresAt) {
      logger.warn('OAuth state has expired');
      return null;
    }
    
    return userId;
  } catch (error) {
    logger.error('Error verifying OAuth state:', error);
    return null;
  }
};

/**
 * Rate limiting for API requests
 * Simple in-memory implementation
 */
const requestCounts: Record<string, { count: number, resetTime: number }> = {};

export const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  
  // Clean up expired entries
  Object.keys(requestCounts).forEach(key => {
    if (requestCounts[key].resetTime < now) {
      delete requestCounts[key];
    }
  });
  
  // Initialize or get current count
  if (!requestCounts[userId] || requestCounts[userId].resetTime < now) {
    requestCounts[userId] = {
      count: 1,
      resetTime: now + windowMs
    };
    return true;
  }
  
  // Check if limit exceeded
  if (requestCounts[userId].count >= zealyConfig.security.maxRequestsPerMinute) {
    logger.warn(`Rate limit exceeded for user ${userId}`);
    return false;
  }
  
  // Increment count
  requestCounts[userId].count++;
  return true;
}; 