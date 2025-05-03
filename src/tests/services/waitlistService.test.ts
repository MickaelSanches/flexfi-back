import fs from "fs";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import WaitlistUser, { IWaitlistedUser } from "../../models/WaitlistUser";
import waitlistService from "../../services/waitlistService";
import { AppError } from "../../utils/AppError";
import { IWaitlistUser } from "../../models/User";

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
      const mockUserData: IWaitlistUser = {};

      const user = await waitlistService.registerWaitlistInfos(mockUserData);

      expect(user).toBeDefined();
      expect(user.formFullfilled).toBe(true);
    });

    it("should throw error when registering with existing email", async () => {
      const mockUserData: IWaitlistUser = {};

      await waitlistService.registerWaitlistInfos(mockUserData);

      try {
        await waitlistService.registerWaitlistInfos(mockUserData);
        fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.name).toBe("MongoServerError");
        expect(error.code).toBe(11000);
      }
    });

    it("should throw error when registering with invalid data", async () => {
      const invalidUserData: IWaitlistUser = {};

      try {
        await waitlistService.registerWaitlistInfos(invalidUserData);
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
      const mockUserData: IWaitlistUser = {
        email: "test@example.com",
        firstName: "Test",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "en",
        country: "CA",
        stateProvince: "CA",
        ipCity: "Montreal",
        deviceLocale: "en-CA",
        deviceType: "desktop",
        browser: "chrome",
        ageGroup: "25-34",
        employmentStatus: "Employed – Full-time",
        monthlyIncome: "$3,000 – $4,999",
        educationLevel: "Bachelor's degree (BA, BS, etc.)",
        hasCreditCard: true,
        bnplServices: ["Klarna", "Afterpay"],
        avgOnlineSpend: "$500 – $999",
        cryptoLevel: "Intermediate",
        walletType: "Metamask",
        portfolioSize: "$1,000 – $9,999",
        favoriteChains: ["Ethereum", "Solana"],
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
        signupTimestamp: new Date(),
      };

      await waitlistService.registerUser(mockUserData);
      const count = await waitlistService.getWaitlistCount();
      expect(count).toBe(1);
    });

    it("should return correct count after adding multiple users", async () => {
      const mockUsers: IWaitlistUser[] = [{}, {}];

      for (const user of mockUsers) {
        await waitlistService.registerWaitlistInfos(user);
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
      const mockUser: IWaitlistUser = {};

      await waitlistService.registerWaitlistInfos(mockUser);
      const { path: filePath, filename } =
        await waitlistService.exportWaitlistToCSV();

      // Display CSV file name content for verification
      console.log("Contenu du fichier CSV:");
      console.log(fs.readFileSync(filePath, "utf-8"));
      console.log("Nom du fichier CSV:");
      console.log(filename);

      expect(fs.existsSync(filePath)).toBe(true);

      const fileContent = fs.readFileSync(filePath, "utf-8");
      expect(fileContent).toContain(mockUser.email);
      expect(fileContent).toContain(mockUser.formData.consent_data_sharing);
      expect(fileContent).toContain(mockUser.formData.timeToCompletionSeconds);

      fs.unlinkSync(filePath);
    });

    it("should handle empty waitlist", async () => {
      const { path: filePath } = await waitlistService.exportWaitlistToCSV();

      expect(fs.existsSync(filePath)).toBe(true);

      const fileContent = fs.readFileSync(filePath, "utf-8");
      expect(fileContent).toContain("email");
      expect(fileContent).toContain("firstName");
      expect(fileContent).toContain("phoneNumber");

      fs.unlinkSync(filePath);
    });

    it("should handle special characters in CSV export", async () => {
      const mockUser: IWaitlistUser = {};

      await waitlistService.registerWaitlistInfos(mockUser);
      const { path: filePath } = await waitlistService.exportWaitlistToCSV();
      const csvContent = fs.readFileSync(filePath, "utf-8");

      expect(csvContent).toContain("Jean-François");
      expect(csvContent).toContain("test123");
      expect(csvContent).toContain("Québec");
      expect(csvContent).toContain("Montréal");

      fs.unlinkSync(filePath);
    });

    it("should handle empty values in CSV export", async () => {
      const mockUser: IWaitlistUser = {};

      await waitlistService.registerWaitlistInfos(mockUser);
      const { path: filePath } = await waitlistService.exportWaitlistToCSV();
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
      expect(csvData.firstName).toBe(mockUser.formData.consent_data_sharing);
      expect(csvData.phoneNumber).toBe("");

      fs.unlinkSync(filePath);
    });
  });
});
