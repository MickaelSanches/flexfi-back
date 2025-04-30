import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import WaitlistUser from "../../models/WaitlistUser";

// Configuration de la variable d'environnement JWT_SECRET
process.env.JWT_SECRET = "test_secret_key_for_jwt_tokens";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await WaitlistUser.createIndexes();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await WaitlistUser.deleteMany({});
});

describe("Waitlist API", () => {
  describe("POST /api/waitlist", () => {
    it("should register a new waitlist user", async () => {
      const mockUserData = {
        email: "test@example.com",
        firstName: "Test",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "en",
        country: "United States",
        stateProvince: "California",
        ageGroup: "18-29",
        employmentStatus: "Employed – Full-time",
        monthlyIncome: "$3,000 – $4,999",
        educationLevel: "Bachelor's degree (BA, BS, etc.)",
        hasCreditCard: true,
        bnplServices: ["Klarna", "Afterpay"],
        avgOnlineSpend: "$700 – $999",
        cryptoLevel: "Intermediate",
        walletType: "Metamask",
        portfolioSize: "$1,000 – $9,999",
        favoriteChains: ["Solana", "Ethereum"],
        publicWallet: "0x123...",
        mainReason: "Buy Now, Pay Later (BNPL) with crypto",
        firstPurchase: "Test purchase",
        utmSource: "test",
        utmMedium: "test",
        utmCampaign: "test",
        landingVariant: "A",
        timeToCompletionSeconds: 120,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date().toISOString(),
        experienceBnplRating: 4,
      };

      const res = await request(app).post("/api/waitlist").send(mockUserData);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");

      Object.entries(mockUserData).forEach(([key, value]) => {
        expect(res.body.data).toHaveProperty(key, value);
      });

      // Check that the server controller has added the fields that aren't in the request
      expect(res.body.data.ipCity).toBeDefined();
      expect(res.body.data.deviceLocale).toBeDefined();
      expect(res.body.data.deviceType).toBeDefined();
      expect(res.body.data.browser).toBeDefined();
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/api/waitlist").send({
        email: "test@example.com",
        // Missing required fields
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("errors");
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it("should return 409 if email already exists", async () => {
      // Create a user
      await request(app)
        .post("/api/waitlist")
        .send({
          email: "existing@example.com",
          firstName: "Test",
          phoneNumber: "+1234567890",
          telegramOrDiscordId: "test123",
          preferredLanguage: "en",
          country: "United States",
          stateProvince: "California",
          ageGroup: "18-29",
          employmentStatus: "Employed – Full-time",
          monthlyIncome: "$3,000 – $4,999",
          educationLevel: "Bachelor's degree (BA, BS, etc.)",
          hasCreditCard: true,
          bnplServices: ["Klarna", "Afterpay"],
          avgOnlineSpend: "$700 – $999",
          cryptoLevel: "Intermediate",
          walletType: "Metamask",
          portfolioSize: "$1,000 – $9,999",
          favoriteChains: ["Solana", "Ethereum"],
          publicWallet: "0x123...",
          mainReason: "Buy Now, Pay Later (BNPL) with crypto",
          firstPurchase: "Test purchase",
          utmSource: "test",
          utmMedium: "test",
          utmCampaign: "test",
          landingVariant: "A",
          timeToCompletionSeconds: 120,
          consentMarketing: true,
          consentAdult: true,
          consent_data_sharing: true,
          consent_data_sharing_date: new Date().toISOString(),
          experienceBnplRating: 4,
        });

      // Try to create another user with the same email
      const res = await request(app)
        .post("/api/waitlist")
        .send({
          email: "existing@example.com",
          firstName: "Test2",
          phoneNumber: "+1234567891",
          telegramOrDiscordId: "test124",
          preferredLanguage: "en",
          country: "United States",
          stateProvince: "California",
          ageGroup: "18-29",
          employmentStatus: "Employed – Full-time",
          monthlyIncome: "$3,000 – $4,999",
          educationLevel: "Bachelor's degree (BA, BS, etc.)",
          hasCreditCard: true,
          bnplServices: ["Klarna", "Afterpay"],
          avgOnlineSpend: "$700 – $999",
          cryptoLevel: "Intermediate",
          walletType: "Metamask",
          portfolioSize: "$1,000 – $9,999",
          favoriteChains: ["Solana", "Ethereum"],
          publicWallet: "0x123...",
          mainReason: "Buy Now, Pay Later (BNPL) with crypto",
          firstPurchase: "Test purchase",
          utmSource: "test",
          utmMedium: "test",
          utmCampaign: "test",
          landingVariant: "A",
          timeToCompletionSeconds: 120,
          consentMarketing: true,
          consentAdult: true,
          consent_data_sharing: true,
          consent_data_sharing_date: new Date().toISOString(),
          experienceBnplRating: 4,
        });

      expect(res.status).toBe(409);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("already exists");
    });
  });

  describe("GET /api/waitlist/count", () => {
    it("should return the total count of waitlist users", async () => {
      // Create some test users
      const mockUsers = [
        {
          email: "user1@example.com",
          firstName: "User1",
          phoneNumber: "+1234567890",
          telegramOrDiscordId: "user1",
          preferredLanguage: "en",
          country: "United States",
          stateProvince: "California",
          ageGroup: "18-29",
          employmentStatus: "Employed – Full-time",
          monthlyIncome: "$3,000 – $4,999",
          educationLevel: "Bachelor's degree (BA, BS, etc.)",
          hasCreditCard: true,
          bnplServices: ["Klarna", "Afterpay"],
          avgOnlineSpend: "$700 – $999",
          cryptoLevel: "Intermediate",
          walletType: "Metamask",
          portfolioSize: "$1,000 – $9,999",
          favoriteChains: ["Solana", "Ethereum"],
          publicWallet: "0x123...",
          mainReason: "Buy Now, Pay Later (BNPL) with crypto",
          firstPurchase: "Test purchase",
          utmSource: "test",
          utmMedium: "test",
          utmCampaign: "test",
          landingVariant: "A",
          timeToCompletionSeconds: 120,
          consentMarketing: true,
          consentAdult: true,
          consent_data_sharing: true,
          consent_data_sharing_date: new Date().toISOString(),
          experienceBnplRating: 4,
        },
        {
          email: "user2@example.com",
          firstName: "User2",
          phoneNumber: "+1234567891",
          telegramOrDiscordId: "user2",
          preferredLanguage: "fr",
          country: "France",
          stateProvince: "Île-de-France",
          ageGroup: "30-44",
          employmentStatus: "Self-employed / Freelancer",
          monthlyIncome: "$5,000 – $9,999",
          educationLevel: "Master's degree (MA, MSc, MBA, etc.)",
          hasCreditCard: true,
          bnplServices: ["Alma", "Oney"],
          avgOnlineSpend: "$1,000 – $1,499",
          cryptoLevel: "Crypto Native",
          walletType: "Phantom",
          portfolioSize: "$10,000 – $49,999",
          favoriteChains: ["Solana", "Bitcoin"],
          publicWallet: "0x456...",
          mainReason: "Earn yield or rewards on purchases",
          firstPurchase: "Test purchase 2",
          utmSource: "test2",
          utmMedium: "test2",
          utmCampaign: "test2",
          landingVariant: "B",
          timeToCompletionSeconds: 180,
          consentMarketing: true,
          consentAdult: true,
          consent_data_sharing: true,
          consent_data_sharing_date: new Date().toISOString(),
          experienceBnplRating: 5,
        },
      ];

      await WaitlistUser.insertMany(mockUsers);

      const res = await request(app).get("/api/waitlist/count");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status", "success");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("count", 2);
    });

    it("should return 0 when no users are in the waitlist", async () => {
      const res = await request(app).get("/api/waitlist/count");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status", "success");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("count", 0);
    });
  });

  describe("GET /api/waitlist/referral/:code", () => {
    it("should return the number of referrals for a valid code", async () => {
      // Create users with the same referral code
      const referralCode = "REF123";
      const mockUsers = [
        {
          email: "user1@example.com",
          firstName: "User1",
          phoneNumber: "+1234567890",
          telegramOrDiscordId: "user1",
          preferredLanguage: "en",
          country: "United States",
          stateProvince: "California",
          ageGroup: "18-29",
          employmentStatus: "Employed – Full-time",
          monthlyIncome: "$3,000 – $4,999",
          educationLevel: "Bachelor's degree (BA, BS, etc.)",
          hasCreditCard: true,
          bnplServices: ["Klarna", "Afterpay"],
          avgOnlineSpend: "$700 – $999",
          cryptoLevel: "Intermediate",
          walletType: "Metamask",
          portfolioSize: "$1,000 – $9,999",
          favoriteChains: ["Solana", "Ethereum"],
          publicWallet: "0x123...",
          mainReason: "Buy Now, Pay Later (BNPL) with crypto",
          firstPurchase: "Test purchase",
          utmSource: "test",
          utmMedium: "test",
          utmCampaign: "test",
          landingVariant: "A",
          timeToCompletionSeconds: 120,
          consentMarketing: true,
          consentAdult: true,
          consent_data_sharing: true,
          consent_data_sharing_date: new Date().toISOString(),
          experienceBnplRating: 4,
          userReferralCode: referralCode,
        },
        {
          email: "user2@example.com",
          firstName: "User2",
          phoneNumber: "+1234567891",
          telegramOrDiscordId: "user2",
          preferredLanguage: "fr",
          country: "France",
          stateProvince: "Île-de-France",
          ageGroup: "30-44",
          employmentStatus: "Self-employed / Freelancer",
          monthlyIncome: "$5,000 – $9,999",
          educationLevel: "Master's degree (MA, MSc, MBA, etc.)",
          hasCreditCard: true,
          bnplServices: ["Alma", "Oney"],
          avgOnlineSpend: "$1,000 – $1,499",
          cryptoLevel: "Crypto Native",
          walletType: "Phantom",
          portfolioSize: "$10,000 – $49,999",
          favoriteChains: ["Solana", "Bitcoin"],
          publicWallet: "0x456...",
          mainReason: "Earn yield or rewards on purchases",
          firstPurchase: "Test purchase 2",
          utmSource: "test2",
          utmMedium: "test2",
          utmCampaign: "test2",
          landingVariant: "B",
          timeToCompletionSeconds: 180,
          consentMarketing: true,
          consentAdult: true,
          consent_data_sharing: true,
          consent_data_sharing_date: new Date().toISOString(),
          experienceBnplRating: 5,
          userReferralCode: referralCode,
        },
      ];

      await WaitlistUser.insertMany(mockUsers);

      const res = await request(app).get(
        `/api/waitlist/referral/${referralCode}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status", "success");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("code", referralCode);
      expect(res.body.data).toHaveProperty("referrals", 2);
    });

    it("should return 0 referrals for a non-existent code", async () => {
      const nonExistentCode = "NONEXISTENT";
      const res = await request(app).get(
        `/api/waitlist/referral/${nonExistentCode}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status", "success");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("code", nonExistentCode);
      expect(res.body.data).toHaveProperty("referrals", 0);
    });
  });
});
