import { Request } from 'express';
import { UserDocument } from '../types/express';

/**
 * Safely extracts the user ID from the request object
 * @param req Express request object
 * @returns User ID as string or undefined if not available
 */
export const getUserIdFromRequest = (req: Request): string | undefined => {
  // Type cast to UserDocument to solve the TypeScript error
  const user = req.user as UserDocument | undefined;
  return user?._id?.toString();
}; 