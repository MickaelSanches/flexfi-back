import User, { IUser } from "../models/User";
import { generateToken } from "../utils/jwt";
import {
  AppError,
  ConflictError,
  UnauthorizedError,
  InternalError,
} from "../utils/AppError";
import { isPasswordStrong } from "../utils/validators";

export class AuthService {
  // Inscription avec email/mot de passe
  async registerWithEmail(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<{ user: IUser; token: string }> {
    try {
      // Vérification de la robustesse du mot de passe
      if (!isPasswordStrong(password)) {
        throw ConflictError(
          "Password must be at least 12 characters long and include uppercase, lowercase, number, and special character."
        );
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw ConflictError("User already exists");
      }

      // Créer un nouvel utilisateur
      const user = new User({
        email,
        password,
        firstName,
        lastName,
        authMethod: "email",
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
}

export default new AuthService();
