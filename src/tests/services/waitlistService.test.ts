import fs from "fs";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import WaitlistUser from "../../models/WaitlistUser";
import waitlistService from "../../services/waitlistService";
import { AppError } from "../../utils/AppError";

let mongoServer: MongoMemoryServer;

// Setup MongoDB in-memory server before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await WaitlistUser.createIndexes();
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database before each test
beforeEach(async () => {
  await WaitlistUser.deleteMany({});
});

describe("WaitlistService", () => {
  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      const mockUserData = {
        email: "test@example.com",
        firstName: "Test",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "en",
        country: "CA",
        stateProvince: "CA",
        ageGroup: "25-34",
        employmentStatus: "Employed – Full-time",
        monthlyIncome: "$3,000 – $4,999",
        educationLevel: "Bachelor's degree (BA, BS, etc.)",
        hasCreditCard: true,
        bnplServices: ["service1", "service2"],
        avgOnlineSpend: "$500 – $999",
        cryptoLevel: "Intermediate",
        walletType: "Metamask",
        portfolioSize: "$1,000 – $9,999",
        favoriteChains: ["ethereum", "solana"],
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

      const user = await waitlistService.registerUser(mockUserData);

      expect(user).toBeDefined();
      expect(user.email).toBe(mockUserData.email);
      expect(user.firstName).toBe(mockUserData.firstName);
      expect(user.phoneNumber).toBe(mockUserData.phoneNumber);
    });

    it("should throw error when registering with existing email", async () => {
      const mockUserData = {
        email: "existing@example.com",
        firstName: "Test",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "en",
        country: "CA",
        stateProvince: "CA",
        ageGroup: "25-34",
        employmentStatus: "Employed – Full-time",
        monthlyIncome: "$3,000 – $4,999",
        educationLevel: "Bachelor's degree (BA, BS, etc.)",
        hasCreditCard: true,
        bnplServices: ["service1", "service2"],
        avgOnlineSpend: "$500 – $999",
        cryptoLevel: "Intermediate",
        walletType: "Metamask",
        portfolioSize: "$1,000 – $9,999",
        favoriteChains: ["ethereum", "solana"],
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

      await waitlistService.registerUser(mockUserData);

      try {
        await waitlistService.registerUser(mockUserData);
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.name).toBe("MongoServerError");
        expect(error.code).toBe(11000);
      }
    });

    it("should throw error when registering with invalid data", async () => {
      const invalidUserData = {
        email: "invalid-email",
        firstName: "",
        phoneNumber: "123",
      };

      try {
        await waitlistService.registerUser(invalidUserData as any);
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.name).toBe("ValidationError");
      }
    });
  });

  describe("getWaitlistCount", () => {
    it("should return 0 when waitlist is empty", async () => {
      const count = await waitlistService.getWaitlistCount();
      expect(count).toBe(0);
    });

    it("should return 1 after adding one user", async () => {
      const mockUserData = {
        email: "test@example.com",
        firstName: "Test",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "en",
        country: "CA",
        stateProvince: "CA",
        ageGroup: "25-34",
        employmentStatus: "Employed – Full-time",
        monthlyIncome: "$3,000 – $4,999",
        educationLevel: "Bachelor's degree (BA, BS, etc.)",
        hasCreditCard: true,
        bnplServices: ["service1", "service2"],
        avgOnlineSpend: "$500 – $999",
        cryptoLevel: "Intermediate",
        walletType: "Metamask",
        portfolioSize: "$1,000 – $9,999",
        favoriteChains: ["ethereum", "solana"],
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

      await waitlistService.registerUser(mockUserData);
      const count = await waitlistService.getWaitlistCount();
      expect(count).toBe(1);
    });

    it("should return correct count after adding multiple users", async () => {
      const mockUsers = [
        {
          email: "test1@example.com",
          firstName: "Test1",
          phoneNumber: "+1234567890",
          telegramOrDiscordId: "test123",
          preferredLanguage: "en",
          country: "CA",
          stateProvince: "CA",
          ageGroup: "25-34",
          employmentStatus: "Employed – Full-time",
          monthlyIncome: "$3,000 – $4,999",
          educationLevel: "Bachelor's degree (BA, BS, etc.)",
          hasCreditCard: true,
          bnplServices: ["service1", "service2"],
          avgOnlineSpend: "$500 – $999",
          cryptoLevel: "Intermediate",
          walletType: "Metamask",
          portfolioSize: "$1,000 – $9,999",
          favoriteChains: ["ethereum", "solana"],
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
        },
        {
          email: "test2@example.com",
          firstName: "Test2",
          phoneNumber: "+1234567891",
          telegramOrDiscordId: "test124",
          preferredLanguage: "en",
          country: "CA",
          stateProvince: "CA",
          ageGroup: "25-34",
          employmentStatus: "Employed – Full-time",
          monthlyIncome: "$3,000 – $4,999",
          educationLevel: "Bachelor's degree (BA, BS, etc.)",
          hasCreditCard: true,
          bnplServices: ["service1", "service2"],
          avgOnlineSpend: "$500 – $999",
          cryptoLevel: "Intermediate",
          walletType: "Metamask",
          portfolioSize: "$1,000 – $9,999",
          favoriteChains: ["ethereum", "solana"],
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
        },
      ];

      for (const user of mockUsers) {
        await waitlistService.registerUser(user);
      }

      const count = await waitlistService.getWaitlistCount();
      expect(count).toBe(2);
    });

    it("should throw error when database connection fails", async () => {
      await mongoose.disconnect();

      try {
        await waitlistService.getWaitlistCount();
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(500);
      }

      await mongoose.connect(mongoServer.getUri());
    });
  });

  describe("exportWaitlistToCSV", () => {
    it("should export waitlist to CSV successfully", async () => {
      const mockUserData = {
        email: "test@example.com",
        firstName: "Test",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "en",
        country: "CA",
        stateProvince: "CA",
        ipCity: "Montreal",
        deviceLocale: "en-US",
        ageGroup: "25-34",
        employmentStatus: "Employed – Full-time",
        monthlyIncome: "$3,000 – $4,999",
        educationLevel: "Bachelor's degree (BA, BS, etc.)",
        hasCreditCard: true,
        bnplServices: ["service1", "service2"],
        avgOnlineSpend: "$500 – $999",
        cryptoLevel: "Intermediate",
        walletType: "Metamask",
        portfolioSize: "$1,000 – $9,999",
        favoriteChains: ["ethereum", "solana"],
        publicWallet: "0x123...",
        mainReason: "Buy Now, Pay Later (BNPL) with crypto",
        firstPurchase: "100-500",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "test",
        landingVariant: "A",
        deviceType: "desktop",
        browser: "chrome",
        timeToCompletionSeconds: 120,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        experienceBnplRating: 4,
      };

      await waitlistService.registerUser(mockUserData);
      const filePath = await waitlistService.exportWaitlistToCSV();

      expect(fs.existsSync(filePath)).toBe(true);

      const fileContent = fs.readFileSync(filePath, "utf-8");
      expect(fileContent).toContain(mockUserData.email);
      expect(fileContent).toContain(mockUserData.firstName);
      expect(fileContent).toContain(mockUserData.phoneNumber);

      fs.unlinkSync(filePath);
    });

    it("should handle empty waitlist", async () => {
      const filePath = await waitlistService.exportWaitlistToCSV();

      expect(fs.existsSync(filePath)).toBe(true);

      const fileContent = fs.readFileSync(filePath, "utf-8");
      expect(fileContent).toContain("email");
      expect(fileContent).toContain("firstName");
      expect(fileContent).toContain("phoneNumber");

      fs.unlinkSync(filePath);
    });

    it("should throw error when directory creation fails", async () => {
      const originalExistsSync = fs.existsSync;
      const originalMkdirSync = fs.mkdirSync;

      fs.existsSync = jest.fn().mockReturnValue(false);
      fs.mkdirSync = jest.fn().mockImplementation(() => {
        throw new Error("Directory creation failed");
      });

      await expect(waitlistService.exportWaitlistToCSV()).rejects.toThrow(
        "Failed to export waitlist to CSV"
      );

      fs.existsSync = originalExistsSync;
      fs.mkdirSync = originalMkdirSync;
    });

    it("should throw error when file writing fails", async () => {
      const mockUserData = {
        email: "test@example.com",
        firstName: "Test",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "en",
        country: "CA",
        stateProvince: "CA",
        ipCity: "Montreal",
        deviceLocale: "en-US",
        ageGroup: "25-34",
        employmentStatus: "Employed – Full-time",
        monthlyIncome: "$3,000 – $4,999",
        educationLevel: "Bachelor's degree (BA, BS, etc.)",
        hasCreditCard: true,
        bnplServices: ["service1", "service2"],
        avgOnlineSpend: "$500 – $999",
        cryptoLevel: "Intermediate",
        walletType: "Metamask",
        portfolioSize: "$1,000 – $9,999",
        favoriteChains: ["ethereum", "solana"],
        publicWallet: "0x123...",
        mainReason: "Buy Now, Pay Later (BNPL) with crypto",
        firstPurchase: "100-500",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "test",
        landingVariant: "A",
        deviceType: "desktop",
        browser: "chrome",
        timeToCompletionSeconds: 120,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        experienceBnplRating: 4,
      };

      await waitlistService.registerUser(mockUserData);

      const originalWriteFileSync = fs.writeFileSync;
      fs.writeFileSync = jest.fn().mockImplementation(() => {
        throw new Error("File writing failed");
      });

      try {
        await waitlistService.exportWaitlistToCSV();
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(500);
      } finally {
        fs.writeFileSync = originalWriteFileSync;
      }
    });

    it("should handle special characters in CSV", async () => {
      const userWithSpecialChars = {
        email: "test@example.com",
        firstName: "Test-Name",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test@discord",
        preferredLanguage: "en",
        country: "CA",
        stateProvince: "Québec",
        ipCity: "Montréal",
        deviceLocale: "en-US",
        ageGroup: "25-34",
        employmentStatus: "Employed – Full-time",
        monthlyIncome: "$3,000 – $4,999",
        educationLevel: "Bachelor's degree (BA, BS, etc.)",
        hasCreditCard: true,
        bnplServices: ["service1", "service2"],
        avgOnlineSpend: "$500 – $999",
        cryptoLevel: "Intermediate",
        walletType: "Metamask",
        portfolioSize: "$1,000 – $9,999",
        favoriteChains: ["ethereum", "solana"],
        publicWallet: "0x123...",
        mainReason: "Buy Now, Pay Later (BNPL) with crypto",
        firstPurchase: "100-500",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "test",
        landingVariant: "A",
        deviceType: "desktop",
        browser: "chrome",
        timeToCompletionSeconds: 120,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        experienceBnplRating: 4,
      };

      await waitlistService.registerUser(userWithSpecialChars);
      const filePath = await waitlistService.exportWaitlistToCSV();
      const content = fs.readFileSync(filePath, "utf-8");

      expect(content).toContain("Test-Name");
      expect(content).toContain("test@discord");
      expect(content).toContain("Québec");
      expect(content).toContain("Montréal");

      fs.unlinkSync(filePath);
    });

    it("should handle special characters in CSV export", async () => {
      const mockUser = {
        email: "test@example.com",
        firstName: "Jean-François",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "user@discord#123",
        preferredLanguage: "fr",
        country: "CA",
        stateProvince: "Québec",
        ipCity: "Montréal",
        deviceLocale: "fr-CA",
        ageGroup: "25-34",
        employmentStatus: "Employed – Full-time",
        monthlyIncome: "$3,000 – $4,999",
        educationLevel: "Bachelor's degree (BA, BS, etc.)",
        hasCreditCard: true,
        bnplServices: ["service1", "service2"],
        avgOnlineSpend: "$500 – $999",
        cryptoLevel: "Intermediate",
        walletType: "Metamask",
        portfolioSize: "$1,000 – $9,999",
        favoriteChains: ["ethereum", "solana"],
        publicWallet: "0x123...",
        mainReason: "Buy Now, Pay Later (BNPL) with crypto",
        firstPurchase: "100-500",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "test",
        landingVariant: "A",
        deviceType: "desktop",
        browser: "chrome",
        timeToCompletionSeconds: 120,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        experienceBnplRating: 4,
      };

      await waitlistService.registerUser(mockUser);
      const filePath = await waitlistService.exportWaitlistToCSV();
      const csvContent = fs.readFileSync(filePath, "utf-8");

      expect(csvContent).toContain("Jean-François");
      expect(csvContent).toContain("user@discord#123");
      expect(csvContent).toContain("Québec");
      expect(csvContent).toContain("Montréal");

      fs.unlinkSync(filePath);
    });

    it("should handle empty values in CSV export", async () => {
      const mockUser = {
        email: "test@example.com",
        firstName: "Test",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "en",
        country: "CA",
        stateProvince: "CA",
        ipCity: "Montreal",
        deviceLocale: "en-US",
        ageGroup: "25-34",
        employmentStatus: "Employed – Full-time",
        monthlyIncome: "$3,000 – $4,999",
        educationLevel: "Bachelor's degree (BA, BS, etc.)",
        hasCreditCard: true,
        bnplServices: ["service1", "service2"],
        avgOnlineSpend: "$500 – $999",
        cryptoLevel: "Intermediate",
        walletType: "Metamask",
        portfolioSize: "$1,000 – $9,999",
        favoriteChains: ["ethereum", "solana"],
        publicWallet: "0x123...",
        mainReason: "Buy Now, Pay Later (BNPL) with crypto",
        firstPurchase: "100-500",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "test",
        landingVariant: "A",
        deviceType: "desktop",
        browser: "chrome",
        timeToCompletionSeconds: 120,
        consentMarketing: true,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        experienceBnplRating: 4,
      };

      await waitlistService.registerUser(mockUser);
      const filePath = await waitlistService.exportWaitlistToCSV();
      const csvContent = fs.readFileSync(filePath, "utf-8");

      const lines = csvContent.split("\n");
      const headers = lines[0].split(",");

      const values: string[] = [];
      let currentValue = "";
      let inQuotes = false;

      for (let i = 0; i < lines[1].length; i++) {
        const char = lines[1][i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(currentValue);
          currentValue = "";
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue);

      const csvData = headers.reduce((acc, header, index) => {
        acc[header] = values[index];
        return acc;
      }, {} as Record<string, string>);

      expect(csvData.referralCodeUsed).toBe("");
      expect(csvData.userReferralCode).toBe("");
      expect(csvData.email).toBe(mockUser.email);
      expect(csvData.firstName).toBe(mockUser.firstName);
      expect(csvData.phoneNumber).toBe(mockUser.phoneNumber);

      fs.unlinkSync(filePath);
    });
  });
});
