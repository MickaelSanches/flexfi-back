import { Document } from "mongoose";
import { User, UserDocument } from "../models/User";
import {
  AppError,
  ConflictError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/AppError";
import { generateToken } from "../utils/jwt";

export class AuthService {
  // Inscription avec email/mot de passe
  async registerWithEmail(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    referralCodeUsed?: string,
    deviceType?: string,
    browser?: string,
    ipCity?: string,
    deviceLocale?: string
  ): Promise<{ user: UserDocument; token: string }> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw ConflictError("User already exists");
      }

      // Créer un referral code
      const referralCode = await this.generateUniqueReferralCode();
      // Créer un nouvel utilisateur
      const user = new User({
        email: email.toLowerCase(),
        password: password,
        firstName: firstName?.toLowerCase(),
        lastName: lastName?.toLowerCase(),
        authMethod: "email",
        referralCodeUsed: referralCodeUsed?.toUpperCase(),
        userReferralCode: referralCode.toUpperCase(),
        deviceType: deviceType,
        browser: browser,
        ipCity: ipCity,
        deviceLocale: deviceLocale,
      });

      await user.save();

      // Générer un JWT
      const token = generateToken(user);

      // Vérifier et appliquer les points de parrainage
      if (referralCodeUsed) {
        await User.findOneAndUpdate(
          { userReferralCode: referralCodeUsed.toUpperCase() },
          {
            $inc: {
              flexpoints_native: 5,
              flexpoints_total: 5,
            },
          }
        );
      }

      return { user, token };
    } catch (error: any) {
      // Propager l'erreur AppError
      if (error instanceof AppError) throw error;
      // Sinon envelopper dans InternalError
      throw InternalError(`Registration failed: ${error.message}`);
    }
  }

  // Connexion avec email/mot de passe
  async loginWithEmail(
    email: string,
    password: string
  ): Promise<{ user: UserDocument; token: string }> {
    try {
      // Trouver l'utilisateur
      const user = await User.findOne({ email });
      if (!user) {
        throw UnauthorizedError("Invalid credentials");
      }

      // Vérifier le mot de passe
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw UnauthorizedError("Invalid credentials");
      }

      // Générer un JWT
      const token = generateToken(user);

      return { user, token };
    } catch (error: any) {
      // Propager l'erreur AppError
      if (error instanceof AppError) throw error;
      // Sinon envelopper dans InternalError
      throw InternalError(`Login failed: ${error.message}`);
    }
  }

  // Trouver ou créer un utilisateur via OAuth (Google, Apple, Twitter)
  async findOrCreateOAuthUser(
    profile: any,
    authMethod: "google" | "apple" | "twitter"
  ): Promise<{ user: UserDocument; token: string }> {
    try {
      let user: UserDocument | null = null;

      // Déterminer l'ID basé sur la méthode d'auth
      let query: any = { email: profile.email };

      // Trouver l'utilisateur existant
      user = await User.findOne(query);

      if (!user) {
        // Créer un nouvel utilisateur
        user = new User({
          email: profile.email,
          firstName:
            profile.firstName || profile.given_name || profile.name?.givenName,
          lastName:
            profile.lastName || profile.family_name || profile.name?.familyName,
          authMethod,
        });

        // Ajouter l'ID spécifique au provider
        if (authMethod === "google") user.toObject().googleId = profile.id;
        else if (authMethod === "apple") user.toObject().appleId = profile.id;
        else if (authMethod === "twitter")
          user.toObject().twitterId = profile.id;

        await user.save();
      } else {
        // Mettre à jour l'ID si l'utilisateur existe mais n'a pas encore cet ID
        if (authMethod === "google" && !user.toObject().googleId) {
          user.toObject().googleId = profile.id;
          await user.save();
        } else if (authMethod === "apple" && !user.toObject().appleId) {
          user.toObject().appleId = profile.id;
          await user.save();
        } else if (authMethod === "twitter" && !user.toObject().twitterId) {
          user.toObject().twitterId = profile.id;
          await user.save();
        }
      }

      // Générer un JWT
      const token = generateToken(user);

      return { user: user as UserDocument, token };
    } catch (error: any) {
      // Propager l'erreur AppError
      if (error instanceof AppError) throw error;
      // Sinon envelopper dans InternalError
      throw InternalError(`OAuth authentication failed: ${error.message}`);
    }
  }

  async handleReferralPoints(referralCodeUsed: string) {
    const user = await User.findOne({ userReferralCode: referralCodeUsed });
    if (!user) {
      throw NotFoundError("User not found");
    }
    // Add points to the user
    user.flexpoints_native += 5;
    await user.save();
  }

  private generateReferralCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `FLEX-${code}`;
  }

  private async generateUniqueReferralCode(): Promise<string> {
    let code = this.generateReferralCode();
    let exists = await User.findOne({ userReferralCode: code });
    while (exists) {
      code = this.generateReferralCode();
      exists = await User.findOne({ userReferralCode: code });
    }
    return code;
  }

  async getTopReferrals(): Promise<UserDocument[]> {
    try {
      const topReferrals = await User.find()
        .sort({ flexpoints_total: -1 })
        .limit(10);

      if (!topReferrals || topReferrals.length === 0) {
        throw NotFoundError("No referrals found");
      }

      return topReferrals;
    } catch (error: any) {
      // Propager l'erreur AppError
      if (error instanceof AppError) throw error;
      // Sinon envelopper dans InternalError
      throw InternalError(`Failed to get top referrals: ${error.message}`);
    }
  }

  // Récupérer un utilisateur par son ID
  async getUserById(userId: string): Promise<UserDocument> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw NotFoundError("User not found");
      }
      return user;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw InternalError(`Failed to get user: ${error.message}`);
    }
  }

  // Récupérer les points d'un utilisateur
  async getUserPoints(userId: string): Promise<number> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw NotFoundError("User not found");
      }
      return user.flexpoints_total || 0;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw InternalError(`Failed to get user points: ${error.message}`);
    }
  }

  // Récupérer le rang d'un utilisateur
  async getUserRank(userId: string): Promise<number> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw NotFoundError("User not found");
      }

      // Compter le nombre d'utilisateurs avec plus de points
      const rank = await User.countDocuments({
        flexpoints_total: { $gt: user.flexpoints_total || 0 },
      });
      return rank + 1; // +1 car le rang commence à 1
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw InternalError(`Failed to get user rank: ${error.message}`);
    }
  }
}

export default new AuthService();
