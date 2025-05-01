import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import WaitlistUser, { WaitlistFormData } from "../../models/WaitlistUser";

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

// Helper function to compare dates
const compareDates = (received: string, expected: string | Date) => {
  return received === new Date(expected).toISOString();
};

describe("Waitlist API", () => {
  describe("POST /api/waitlist", () => {
    it("should register a new waitlist user", async () => {
      const mockFormData: WaitlistFormData = {
        email: "test@example.com",
        firstName: "Test",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "English",
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
        firstPurchase: "100-500",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "test",
        landingVariant: "A",
        timeToCompletionSeconds: 120,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        experienceBnplRating: 4,
      };

      const res = await request(app).post("/api/waitlist").send(mockFormData);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");

      // Verify that all form data is present
      Object.entries(mockFormData).forEach(([key, value]) => {
        if (key === "consent_data_sharing_date") {
          expect(compareDates(res.body.data[key], value)).toBe(true);
        } else {
          expect(res.body.data).toHaveProperty(key, value);
        }
      });

      // Verify that the controller added the missing fields
      expect(res.body.data.ipCity).toBeDefined();
      expect(res.body.data.deviceLocale).toBeDefined();
      expect(res.body.data.deviceType).toBeDefined();
      expect(res.body.data.browser).toBeDefined();
      expect(res.body.data.signupTimestamp).toBeDefined();

      // Verify that the added fields have valid values
      expect(typeof res.body.data.ipCity).toBe("string");
      expect(typeof res.body.data.deviceLocale).toBe("string");
      expect(typeof res.body.data.deviceType).toBe("string");
      expect(typeof res.body.data.browser).toBe("string");
      expect(new Date(res.body.data.signupTimestamp)).toBeInstanceOf(Date);
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
          email: "test@example.com",
          firstName: "Test",
          phoneNumber: "+1234567890",
          telegramOrDiscordId: "test123",
          preferredLanguage: "English",
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
          firstPurchase: "100-500",
          utmSource: "google",
          utmMedium: "cpc",
          utmCampaign: "test",
          landingVariant: "A",
          timeToCompletionSeconds: 120,
          consentMarketing: true,
          consentAdult: true,
          consent_data_sharing: true,
          consent_data_sharing_date: new Date(),
          experienceBnplRating: 4,
        });

      // Try to create another user with the same email
      const res = await request(app)
        .post("/api/waitlist")
        .send({
          email: "test@example.com",
          firstName: "Test",
          phoneNumber: "+1234567890",
          telegramOrDiscordId: "test123",
          preferredLanguage: "English",
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
          firstPurchase: "100-500",
          utmSource: "google",
          utmMedium: "cpc",
          utmCampaign: "test",
          landingVariant: "A",
          timeToCompletionSeconds: 120,
          consentMarketing: true,
          consentAdult: true,
          consent_data_sharing: true,
          consent_data_sharing_date: new Date(),
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
      const mockUser1: WaitlistFormData = {
        email: "test1@example.com",
        firstName: "Test",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "English",
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
        firstPurchase: "100-500",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "test",
        landingVariant: "A",
        timeToCompletionSeconds: 120,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        experienceBnplRating: 4,
      };
      const mockUser2: WaitlistFormData = {
        email: "test2@example.com",
        firstName: "Test2",
        phoneNumber: "+1234567891",
        telegramOrDiscordId: "test124",
        preferredLanguage: "English",
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
        firstPurchase: "100-500",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "test",
        landingVariant: "A",
        timeToCompletionSeconds: 120,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        experienceBnplRating: 4,
      };

      // Create users sequentially
      const res1 = await request(app).post("/api/waitlist").send(mockUser1);
      console.log("Première réponse:", res1.status, res1.body);
      expect(res1.status).toBe(201);

      const res2 = await request(app).post("/api/waitlist").send(mockUser2);
      console.log("Deuxième réponse:", res2.status, res2.body);
      expect(res2.status).toBe(201);

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
      const mockUser1: WaitlistFormData = {
        email: "user1@example.com",
        firstName: "User1",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "user1",
        preferredLanguage: "English",
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
        firstPurchase: "100-500",
        referralCodeUsed: referralCode,
        utmSource: "test",
        utmMedium: "test",
        utmCampaign: "test",
        landingVariant: "A",
        timeToCompletionSeconds: 120,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        experienceBnplRating: 4,
      };

      const mockUser2: WaitlistFormData = {
        email: "user2@example.com",
        firstName: "User2",
        phoneNumber: "+1234567891",
        telegramOrDiscordId: "user2",
        preferredLanguage: "French",
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
        firstPurchase: "100-500",
        referralCodeUsed: referralCode,
        utmSource: "test2",
        utmMedium: "test2",
        utmCampaign: "test2",
        landingVariant: "B",
        timeToCompletionSeconds: 180,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        experienceBnplRating: 5,
      };

      const [res1, res2] = await Promise.all([
        request(app).post("/api/waitlist").send(mockUser1),
        request(app).post("/api/waitlist").send(mockUser2),
      ]);

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);

      const res = await request(app).get(
        `/api/waitlist/referral/${referralCode}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status", "success");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("code", referralCode);
      expect(res.body.data).toHaveProperty("referrals", 2);
    });

    it("should return 0 for a non-existent referral code", async () => {
      const res = await request(app).get("/api/waitlist/referral/NONEXISTENT");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status", "success");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("referrals", 0);
    });
  });

  describe("GET /api/waitlist/export", () => {
    it("should return a CSV file with all waitlist users", async () => {
      /*// Create test users
      const mockUser1: WaitlistFormData = {
        email: "user1@example.com",
        firstName: "User1",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "user1",
        preferredLanguage: "English",
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
        firstPurchase: "100-500",
        utmSource: "test",
        utmMedium: "test",
        utmCampaign: "test",
        landingVariant: "A",
        timeToCompletionSeconds: 120,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        experienceBnplRating: 4,
      };
      const mockUser2: WaitlistFormData = {
        email: "user2@example.com",
        firstName: "User2",
        phoneNumber: "+1234567891",
        telegramOrDiscordId: "user2",
        preferredLanguage: "French",
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
        firstPurchase: "100-500",
        utmSource: "test2",
        utmMedium: "test2",
        utmCampaign: "test2",
        landingVariant: "B",
        timeToCompletionSeconds: 180,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        experienceBnplRating: 5,
      };

      const [res1, res2] = await Promise.all([
        request(app).post("/api/waitlist").send(mockUser1),
        request(app).post("/api/waitlist").send(mockUser2),
      ]);

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);

      // Get CSV with authentication
      const res = await request(app)
        .get("/api/waitlist/export")
        .set("Authorization", "Bearer test_token");

      expect(res.status).toBe(200);
      expect(res.header["content-type"]).toBe("text/csv");
      expect(res.header["content-disposition"]).toContain("waitlist_users.csv");*/
    });
  });
});
