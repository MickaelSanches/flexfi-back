import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

interface DecodedToken {
  id: string;
  email: string;
  authMethod: string;
}

// Middleware pour vérifier le JWT
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extraire le token du header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ status: 'error', message: 'Authorization token is required' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Vérifier le token
    const decoded = verifyToken(token) as DecodedToken;
    
    // Récupérer l'utilisateur correspondant
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({ status: 'error', message: 'User not found' });
      return;
    }
    
    // Injecter l'utilisateur dans la requête
    req.user = user;
    
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};

// Alias for authenticate middleware for better readability in route definitions
export const authMiddleware = authenticate;

// Middleware pour les routes admin uniquement
export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && (req.user as any).isAdmin) {
    next();
  } else {
    res.status(403).json({ status: 'error', message: 'Admin access required' });
  }
};