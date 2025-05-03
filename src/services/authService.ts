import { IUser, User } from "../models/User";
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
  ): Promise<{ user: IUser; token: string }> {
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
  ): Promise<{ user: IUser; token: string }> {
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
  ): Promise<{ user: IUser; token: string }> {
    try {
      let user: IUser | null = null;

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
        if (authMethod === "google") user.googleId = profile.id;
        else if (authMethod === "apple") user.appleId = profile.id;
        else if (authMethod === "twitter") user.twitterId = profile.id;

        await user.save();
      } else {
        // Mettre à jour l'ID si l'utilisateur existe mais n'a pas encore cet ID
        if (authMethod === "google" && !user.googleId) {
          user.googleId = profile.id;
          await user.save();
        } else if (authMethod === "apple" && !user.appleId) {
          user.appleId = profile.id;
          await user.save();
        } else if (authMethod === "twitter" && !user.twitterId) {
          user.twitterId = profile.id;
          await user.save();
        }
      }

      // Générer un JWT
      const token = generateToken(user);

      return { user, token };
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
    user.points += 5;
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

  async getTopReferrals(): Promise<IUser[]> {
    try {
      const topReferrals = await User.find().sort({ points: -1 }).limit(10);

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
}

export default new AuthService();
