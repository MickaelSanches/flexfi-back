import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import authService from "../../../src/services/authService";
import { User } from "../../../src/models/User";
import { AppError } from "../../../src/utils/AppError";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("AuthService", () => {
  describe("registerWithEmail", () => {
    it("should register a new user", async () => {
      const { user, token } = await authService.registerWithEmail(
        "test@example.com",
        "password123",
        "John",
        "Doe"
      );

      expect(user).toBeDefined();
      expect(user.email).toBe("test@example.com");
      expect(user.firstName).toBe("John");
      expect(user.lastName).toBe("Doe");
      expect(token).toBeDefined();
    });

    it("should throw ConflictError if user already exists", async () => {
      // Créer un utilisateur d'abord
      await authService.registerWithEmail(
        "existing@example.com",
        "password123"
      );

      // Essayer de créer un utilisateur avec le même email
      await expect(
        authService.registerWithEmail("existing@example.com", "password456")
      ).rejects.toThrow(AppError);

      try {
        await authService.registerWithEmail(
          "existing@example.com",
          "password456"
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(409); // Conflict status code
      }
    });
  });

  describe("loginWithEmail", () => {
    it("should login a user with valid credentials", async () => {
      // Créer un utilisateur d'abord
      await authService.registerWithEmail("login@example.com", "password123");

      // Tester la connexion
      const { user, token } = await authService.loginWithEmail(
        "login@example.com",
        "password123"
      );

      expect(user).toBeDefined();
      expect(user.email).toBe("login@example.com");
      expect(token).toBeDefined();
    });

    it("should throw UnauthorizedError with invalid credentials", async () => {
      // Créer un utilisateur d'abord
      await authService.registerWithEmail("login@example.com", "password123");

      // Essayer de se connecter avec un mauvais mot de passe
      await expect(
        authService.loginWithEmail("login@example.com", "wrongpassword")
      ).rejects.toThrow(AppError);

      try {
        await authService.loginWithEmail("login@example.com", "wrongpassword");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(401); // Unauthorized status code
      }
    });
  });
});
