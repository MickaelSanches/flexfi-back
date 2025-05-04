import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { User } from "../../models/User";

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

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.user).toHaveProperty("email", "test@example.com");
      expect(res.body.data).toHaveProperty("token");
    });

    it("should return 400 if email or password is missing", async () => {
      const res = await request(app).post("/api/auth/register").send({
        firstName: "Test",
        lastName: "User",
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toBe("Email and password are required");
    });

    it("should return 409 if user already exists", async () => {
      // Create a user first
      await request(app).post("/api/auth/register").send({
        email: "existing@example.com",
        password: "password123",
      });

      // Try to create a user with the same email
      const res = await request(app).post("/api/auth/register").send({
        email: "existing@example.com",
        password: "password456",
      });

      expect(res.status).toBe(409);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login an existing user", async () => {
      // Create a user first
      await request(app).post("/api/auth/register").send({
        email: "login@example.com",
        password: "password123",
      });

      // Test login
      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.user).toHaveProperty("email", "login@example.com");
      expect(res.body.data).toHaveProperty("token");
    });

    it("should return 401 with invalid credentials", async () => {
      // Create a user first
      await request(app).post("/api/auth/register").send({
        email: "login@example.com",
        password: "password123",
      });

      // Try to login with wrong password
      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Invalid credentials");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should get current user if authenticated", async () => {
      // Create a user and get the token
      const registerRes = await request(app).post("/api/auth/register").send({
        email: "me@example.com",
        password: "password123",
      });

      const token = registerRes.body.data.token;

      // Test /me route
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.user).toHaveProperty("email", "me@example.com");
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(401);
      expect(res.body.status).toBe("error");
    });
  });

  describe("GET /api/auth/top-referrals", () => {
    it("should return top 10 users sorted by points", async () => {
      // Create multiple users with different points
      await User.create([
        {
          email: "user1@example.com",
          password: "password123",
          firstName: "User",
          lastName: "One",
          userReferralCode: "FLEX-ABC123",
          authMethod: "email",
          points: 50,
          formFullfilled: true,
          wallets: [],
          kycStatus: "none",
        },
        {
          email: "user2@example.com",
          password: "password123",
          firstName: "User",
          lastName: "Two",
          userReferralCode: "FLEX-DEF456",
          authMethod: "email",
          points: 30,
          formFullfilled: true,
          wallets: [],
          kycStatus: "none",
        },
        {
          email: "user3@example.com",
          password: "password123",
          firstName: "User",
          lastName: "Three",
          userReferralCode: "FLEX-GHI789",
          authMethod: "email",
          points: 100,
          formFullfilled: true,
          wallets: [],
          kycStatus: "none",
        },
      ]);

      const response = await request(app).get("/api/auth/top-referrals");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("topReferrals");
      expect(response.body.data).toHaveProperty("count");

      const { topReferrals } = response.body.data;
      expect(topReferrals).toHaveLength(3);

      // Verify users are sorted by points in descending order
      expect(topReferrals[0].points).toBe(100);
      expect(topReferrals[1].points).toBe(50);
      expect(topReferrals[2].points).toBe(30);
    });

    it("should return 404 when no users found", async () => {
      // Delete all users
      await User.deleteMany({});

      const response = await request(app).get("/api/auth/top-referrals");

      expect(response.status).toBe(404);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("No referrals found");
    });
  });
});
