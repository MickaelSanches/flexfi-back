import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export class AuthController {
  // Inscription avec email/mot de passe
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ status: 'error', message: 'Email and password are required' });
        return;
      }
      
      const { user, token } = await authService.registerWithEmail(
        email,
        password,
        firstName,
        lastName
      );
      
      // Ne pas renvoyer le mot de passe dans la réponse
      const userResponse = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        authMethod: user.authMethod,
        wallets: user.wallets,
        kycStatus: user.kycStatus,
        selectedCard: user.selectedCard,
      };
      
      res.status(201).json({ 
        status: 'success', 
        data: { user: userResponse, token } 
      });
    } catch (error) {
      // Passer l'erreur au middleware de gestion d'erreurs global
      next(error);
    }
  }
  
  // Connexion avec email/mot de passe
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ status: 'error', message: 'Email and password are required' });
        return;
      }
      
      const { user, token } = await authService.loginWithEmail(email, password);
      
      // Ne pas renvoyer le mot de passe dans la réponse
      const userResponse = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        authMethod: user.authMethod,
        wallets: user.wallets,
        kycStatus: user.kycStatus,
        selectedCard: user.selectedCard,
      };
      
      // Logger la connexion réussie
      logger.info(`User logged in: ${user._id}`, { userId: user._id });
      
      res.status(200).json({ 
        status: 'success', 
        data: { user: userResponse, token } 
      });
    } catch (error) {
      // Passer l'erreur au middleware de gestion d'erreurs global
      next(error);
    }
  }
  
  // Callback pour Google OAuth
  async googleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Passport.js aura déjà authentifié l'utilisateur et mis le profil dans req.user
      const profile = req.user as any;
      
      if (!profile) {
        res.status(401).json({ status: 'error', message: 'Google authentication failed' });
        return;
      }
      
      const { user, token } = await authService.findOrCreateOAuthUser(
        profile,
        'google'
      );
      
      // Logger la connexion OAuth réussie
      logger.info(`User authenticated via Google: ${user._id}`, { userId: user._id });
      
      // En production, redirigez vers le frontend avec le token
      // res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
      
      // Pour cet exemple, nous renvoyons simplement le token
      res.status(200).json({ 
        status: 'success', 
        data: { user, token } 
      });
    } catch (error) {
      // Passer l'erreur au middleware de gestion d'erreurs global
      next(error);
    }
  }
  
  // Callback pour Apple Sign In
  async appleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Passport.js aura déjà authentifié l'utilisateur et mis le profil dans req.user
      const profile = req.user as any;
      
      if (!profile) {
        res.status(401).json({ status: 'error', message: 'Apple authentication failed' });
        return;
      }
      
      const { user, token } = await authService.findOrCreateOAuthUser(
        profile,
        'apple'
      );
      
      // Logger la connexion OAuth réussie
      logger.info(`User authenticated via Apple: ${user._id}`, { userId: user._id });
      
      // En production, redirigez vers le frontend avec le token
      // res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
      
      // Pour cet exemple, nous renvoyons simplement le token
      res.status(200).json({ 
        status: 'success', 
        data: { user, token } 
      });
    } catch (error) {
      // Passer l'erreur au middleware de gestion d'erreurs global
      next(error);
    }
  }
  
  // Callback pour Twitter OAuth
  async twitterCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Passport.js aura déjà authentifié l'utilisateur et mis le profil dans req.user
      const profile = req.user as any;
      
      if (!profile) {
        res.status(401).json({ status: 'error', message: 'Twitter authentication failed' });
        return;
      }
      
      const { user, token } = await authService.findOrCreateOAuthUser(
        profile,
        'twitter'
      );
      
      // Logger la connexion OAuth réussie
      logger.info(`User authenticated via Twitter: ${user._id}`, { userId: user._id });
      
      // En production, redirigez vers le frontend avec le token
      // res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
      
      // Pour cet exemple, nous renvoyons simplement le token
      res.status(200).json({ 
        status: 'success', 
        data: { user, token } 
      });
    } catch (error) {
      // Passer l'erreur au middleware de gestion d'erreurs global
      next(error);
    }
  }
  
  // Récupérer l'utilisateur actuel
  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // req.user est injecté par le middleware d'authentification
      const user = req.user;
      
      if (!user) {
        res.status(401).json({ status: 'error', message: 'Not authenticated' });
        return;
      }
      
      res.status(200).json({ 
        status: 'success', 
        data: { user } 
      });
    } catch (error) {
      // Passer l'erreur au middleware de gestion d'erreurs global
      next(error);
    }
  }
}

export default new AuthController();