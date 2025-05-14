import { NextFunction, Request, Response } from "express";
import { IBasicUser, User, UserDocument } from "../models/User";
import authService from "../services/authService";
import logger from "../utils/logger";

export class AuthController {
  // Inscription avec email/mot de passe
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        email,
        firstName,
        lastName,
        password,
        referralCodeUsed,
      }: IBasicUser = req.body;

      if (!email || !password) {
        res.status(400).json({
          status: "error",
          message: "Email and password are required",
        });
        return;
      }

      const isVerified = false;
      const deviceType =
        req.headers["sec-ch-ua-platform"]?.toString() || undefined;
      const browser = req.headers["user-agent"]?.toString() || undefined;
      const ipCity =
        req.headers["x-forwarded-for"]?.toString() ||
        req.socket.remoteAddress?.toString() ||
        undefined;
      const deviceLocale =
        req.headers["accept-language"]?.toString() || undefined;

      const { user, token }: { user: UserDocument; token: string } =
        await authService.registerWithEmail(
          email,
          password,
          firstName,
          lastName,
          referralCodeUsed,
          isVerified,
          deviceType,
          browser,
          ipCity,
          deviceLocale
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
        formFullfilled: user.formFullfilled,
        userReferralCode: user.userReferralCode,
        isVerified: user.isVerified,
      };

      res.status(201).json({
        status: "success",
        data: { user: userResponse, token },
      });
    } catch (error) {
      // Passer l'erreur au middleware de gestion d'erreurs global
      next(error);
    }
  }

  async activateAccountViaLink(req: Request, res: Response): Promise<void> {
    try {
      // Récupération sécurisée des paramètres de query
      const id = req.query.id?.toString();
      const token = req.query.token?.toString();

      // Vérification des paramètres
      if (!id || !token) {
        res.status(400).json({ error: "Missing id or token" });
        return;
      }

      // Appel du service pour vérification
      await authService.verifyVerificationCode(id, token);

      // Succès
      res.status(200).json({ message: "Account activated successfully" });
    } catch (error) {
      console.error("Activation error:", error);
      res.status(400).json({ error: "Invalid or expired activation link" });
    }
  }

  async resendVerificationEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      await authService.resendVerificationEmail(email);
      res
        .status(200)
        .json({ message: "Verification email resent successfully" });
    } catch (error) {
      res.status(400).json({
        error:
          (error as Error).message || "Failed to resend verification email",
      });
    }
  }

  // Connexion avec email/mot de passe
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          status: "error",
          message: "Email and password are required",
        });
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
        formFullfilled: user.formFullfilled,
        userReferralCode: user.userReferralCode,
        isVerified: user.isVerified,
      };

      // Logger la connexion réussie
      logger.info(`User logged in: ${user._id}`, { userId: user._id });

      res.status(200).json({
        status: "success",
        data: { user: userResponse, token },
      });
    } catch (error) {
      // Passer l'erreur au middleware de gestion d'erreurs global
      next(error);
    }
  }

  // Callback pour Google OAuth
  async googleCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Passport.js aura déjà authentifié l'utilisateur et mis le profil dans req.user
      const profile = req.user as any;

      if (!profile) {
        res
          .status(401)
          .json({ status: "error", message: "Google authentication failed" });
        return;
      }

      const { user, token } = await authService.findOrCreateOAuthUser(
        profile,
        "google"
      );

      // Logger la connexion OAuth réussie
      logger.info(`User authenticated via Google: ${user._id}`, {
        userId: user._id,
      });

      // En production, redirigez vers le frontend avec le token
      // res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);

      // Pour cet exemple, nous renvoyons simplement le token
      res.status(200).json({
        status: "success",
        data: { user, token },
      });
    } catch (error) {
      // Passer l'erreur au middleware de gestion d'erreurs global
      next(error);
    }
  }

  // Callback pour Apple Sign In
  async appleCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Passport.js aura déjà authentifié l'utilisateur et mis le profil dans req.user
      const profile = req.user as any;

      if (!profile) {
        res
          .status(401)
          .json({ status: "error", message: "Apple authentication failed" });
        return;
      }

      const { user, token } = await authService.findOrCreateOAuthUser(
        profile,
        "apple"
      );

      // Logger la connexion OAuth réussie
      logger.info(`User authenticated via Apple: ${user._id}`, {
        userId: user._id,
      });

      // En production, redirigez vers le frontend avec le token
      // res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);

      // Pour cet exemple, nous renvoyons simplement le token
      res.status(200).json({
        status: "success",
        data: { user, token },
      });
    } catch (error) {
      // Passer l'erreur au middleware de gestion d'erreurs global
      next(error);
    }
  }

  // Callback pour Twitter OAuth
  async twitterCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Passport.js aura déjà authentifié l'utilisateur et mis le profil dans req.user
      const profile = req.user as any;

      if (!profile) {
        res
          .status(401)
          .json({ status: "error", message: "Twitter authentication failed" });
        return;
      }

      const { user, token } = await authService.findOrCreateOAuthUser(
        profile,
        "twitter"
      );

      // Logger la connexion OAuth réussie
      logger.info(`User authenticated via Twitter: ${user._id}`, {
        userId: user._id,
      });

      // En production, redirigez vers le frontend avec le token
      // res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);

      // Pour cet exemple, nous renvoyons simplement le token
      res.status(200).json({
        status: "success",
        data: { user, token },
      });
    } catch (error) {
      // Passer l'erreur au middleware de gestion d'erreurs global
      next(error);
    }
  }

  // Récupérer l'utilisateur actuel
  async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req.user as any)?._id;
      if (!userId) {
        res.status(401).json({
          status: "error",
          message: "Not authenticated",
        });
        return;
      }

      const user = await authService.getUserById(userId.toString());
      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  // Récupérer le top 10 des parrainages
  async getTopReferrals(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const topReferrals = await authService.getTopReferrals();

      // Formater la réponse pour ne pas exposer les données sensibles
      const formattedReferrals = topReferrals.map((user) => ({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        flexpoints_total: user.flexpoints_total,
        userReferralCode: user.userReferralCode,
      }));

      res.status(200).json({
        status: "success",
        data: {
          topReferrals: formattedReferrals,
          count: formattedReferrals.length,
        },
      });
    } catch (error: any) {
      // Logger l'erreur
      logger.error(`Error getting top referrals: ${error.message}`, {
        error: error.stack,
      });
      next(error);
    }
  }

  // Récupérer les points de l'utilisateur
  async getUserPoints(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req.user as UserDocument)?._id;
      if (!userId) {
        res.status(401).json({
          status: "error",
          message: "Not authenticated",
        });
        return;
      }

      const points = await authService.getUserPoints(userId.toString());
      res.status(200).json({
        status: "success",
        data: { points },
      });
    } catch (error) {
      next(error);
    }
  }

  // Récupérer le rang de l'utilisateur
  async getUserRank(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req.user as any)?._id;
      if (!userId) {
        res.status(401).json({
          status: "error",
          message: "Not authenticated",
        });
        return;
      }

      const rank = await authService.getUserRank(userId.toString());
      res.status(200).json({
        status: "success",
        data: { rank },
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyVerificationCode(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { code } = req.body;
      if (!id || !code) {
        res.status(400).json({ error: "Missing id or code" });
        return;
      }
      await authService.verifyVerificationCode(id, code);
      res.status(200).json({ message: "Code verified successfully" });
    } catch (error) {
      res.status(400).json({ error: "Invalid verification code" });
    }
  }

  async verifyResetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      await authService.verifyResetPasswordAndToken(token, password);
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(400).json({ error: "Invalid reset token or password" });
    }
  }
}

export default new AuthController();
