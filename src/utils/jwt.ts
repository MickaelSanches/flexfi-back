import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

// Vérifier les variables d'environnement requises
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

interface JwtPayload {
  id: string;
  email: string;
  authMethod: string;
}

export const generateToken = (user: IUser): string => {
  const payload: JwtPayload = { 
    id: user._id.toString(),
    email: user.email,
    authMethod: user.authMethod
  };
  
  // Utiliser any pour contourner les problèmes de typage
  // Ce n'est pas idéal, mais c'est une solution pragmatique
  return (jwt as any).sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    // Utiliser any pour contourner les problèmes de typage
    return (jwt as any).verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};