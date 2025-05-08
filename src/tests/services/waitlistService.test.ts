import fs from "fs";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { IWaitlistFormData, IWaitlistUser, User } from "../../models/User";
import waitlistService from "../../services/waitlistService";
import { AppError } from "../../utils/AppError";

let mongoServer: MongoMemoryServer;

// Setup MongoDB in-memory server before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  await User.createIndexes();
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database before each test
beforeEach(async () => {
  await User.deleteMany({});
});

describe("WaitlistService", () => {
  describe("registerWaitlistInfos", () => {
    it("should register waitlist information for a user", async () => {
      // Create a basic user first
      const basicUser = await User.create({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
        referralCodeUsed: undefined,
        userReferralCode: "TEST123",
        authMethod: "email",
        formFullfilled: false,
        wallets: [],
        kycStatus: "none",
        points: 0,
      });

      // Simuler les données reçues par le controller
      const formData: IWaitlistFormData = {
        email: "test@example.com",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "English",
        country: "CA",
        stateProvince: "CA",
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
        timeToCompletionSeconds: 120,
        experienceBnplRating: 4,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        consentMarketing: true,
        signupTimestamp: new Date(),
      };

      // Simuler la transformation du controller
      const { email, ...formDataWithoutEmail } = formData;
      const userData: IWaitlistUser = {
        email,
        formData: formDataWithoutEmail,
      };

      const user = await waitlistService.registerWaitlistInfos(userData);

      // Vérifier la réponse comme le controller
      expect(user).toBeDefined();
      expect(user.formFullfilled).toBe(true);
      expect(user.flexpoints_native).toBe(20); // 20 points for completing the form
      expect(user.email).toBe(formData.email);
      expect(user.firstName).toBe(basicUser.firstName);
      expect(user.lastName).toBe(basicUser.lastName);
      expect(user.authMethod).toBe(basicUser.authMethod);
      expect(user.wallets).toEqual(basicUser.wallets);
      expect(user.kycStatus).toBe(basicUser.kycStatus);
    });

    it("should throw error if user does not exist", async () => {
      const formData: IWaitlistFormData = {
        email: "nonexistent@example.com",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "English",
        country: "CA",
        stateProvince: "CA",
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
        timeToCompletionSeconds: 120,
        experienceBnplRating: 4,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        consentMarketing: true,
        signupTimestamp: new Date(),
      };

      const { email, ...formDataWithoutEmail } = formData;
      const userData: IWaitlistUser = {
        email,
        formData: formDataWithoutEmail,
      };

      await expect(
        waitlistService.registerWaitlistInfos(userData)
      ).rejects.toThrow("User not found");
    });

    it("should throw error if form is already submitted", async () => {
      // Create a user with form already submitted
      await User.create({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
        referralCodeUsed: undefined,
        userReferralCode: "TEST123",
        authMethod: "email",
        formFullfilled: true,
        wallets: [],
        kycStatus: "none",
        points: 20,
      });

      const formData: IWaitlistFormData = {
        email: "test@example.com",
        phoneNumber: "+1234567890",
        telegramOrDiscordId: "test123",
        preferredLanguage: "English",
        country: "CA",
        stateProvince: "CA",
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
        timeToCompletionSeconds: 120,
        experienceBnplRating: 4,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        consentMarketing: true,
        signupTimestamp: new Date(),
      };

      const { email, ...formDataWithoutEmail } = formData;
      const userData: IWaitlistUser = {
        email,
        formData: formDataWithoutEmail,
      };

      await expect(
        waitlistService.registerWaitlistInfos(userData)
      ).rejects.toThrow("Form already submitted");
    });
    it("should throw error when form data is incomplete", async () => {
      // Create a basic user first
      const basicUser = await User.create({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
        referralCodeUsed: undefined,
        userReferralCode: "TEST123",
        authMethod: "email",
        formFullfilled: false,
        wallets: [],
        kycStatus: "none",
        points: 0,
      });

      // Simuler des données incomplètes
      const formData: Partial<IWaitlistFormData> = {
        email: "test@example.com",
        phoneNumber: "+1234567890",
        // Manque plusieurs champs requis
      };

      const { email, ...formDataWithoutEmail } = formData;
      const userData: IWaitlistUser = {
        email: email!,
        formData: formDataWithoutEmail as any,
      };

      const result = await waitlistService.registerWaitlistInfos(userData);
      expect(result).toBeDefined();
      expect(result.formFullfilled).toBe(true);
      expect(result.flexpoints_native).toBe(20);
      expect(result.email).toBe("test@example.com");
    });
  });

  describe("getWaitlistCount", () => {
    it("should return correct count of users with completed forms", async () => {
      // Create users with and without completed forms
      await User.create([
        {
          email: "user1@example.com",
          password: "password123",
          firstName: "User",
          lastName: "One",
          userReferralCode: "USER1",
          authMethod: "email",
          formFullfilled: true,
          wallets: [],
          kycStatus: "none",
          points: 20,
        },
        {
          email: "user2@example.com",
          password: "password123",
          firstName: "User",
          lastName: "Two",
          userReferralCode: "USER2",
          authMethod: "email",
          formFullfilled: false,
          wallets: [],
          kycStatus: "none",
          points: 0,
        },
        {
          email: "user3@example.com",
          password: "password123",
          firstName: "User",
          lastName: "Three",
          userReferralCode: "USER3",
          authMethod: "email",
          formFullfilled: true,
          wallets: [],
          kycStatus: "none",
          points: 20,
        },
      ]);

      const count = await waitlistService.getWaitlistCount();
      expect(count).toBe(3);
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
    it("should export waitlist data to CSV", async () => {
      // Create test users
      await User.create([
        {
          email: "user1@example.com",
          password: "password123",
          firstName: "User",
          lastName: "One",
          userReferralCode: "USER1",
          authMethod: "email",
          formFullfilled: true,
          wallets: [],
          kycStatus: "none",
          points: 20,
          phoneNumber: "+1234567890",
          preferredLanguage: "English",
          country: "US",
        },
        {
          email: "user2@example.com",
          password: "password123",
          firstName: "User",
          lastName: "Two",
          userReferralCode: "USER2",
          authMethod: "email",
          formFullfilled: true,
          wallets: [],
          kycStatus: "none",
          points: 20,
          phoneNumber: "+0987654321",
          preferredLanguage: "French",
          country: "FR",
        },
      ]);

      const result = await waitlistService.exportWaitlistToCSV();
      expect(result).toHaveProperty("path");
      expect(result).toHaveProperty("filename");
      expect(result.filename).toMatch(/^waitlist_\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it("should handle empty waitlist", async () => {
      const { path: filePath } = await waitlistService.exportWaitlistToCSV();

      expect(fs.existsSync(filePath)).toBe(true);

      const fileContent = fs.readFileSync(filePath, "utf-8");
      expect(fileContent).toContain("email");
      expect(fileContent).toContain("firstName");
      expect(fileContent).toContain("lastName");
      expect(fileContent).toContain("phoneNumber");

      fs.unlinkSync(filePath);
    });

    it("should handle special characters in CSV export", async () => {
      // Create a user with special characters
      await User.create({
        email: "test@example.com",
        password: "Test123!@#$%",
        firstName: "Jean-François",
        lastName: "Dupont",
        authMethod: "email",
        userReferralCode: "ABC123",
        formFullfilled: true,
        wallets: [],
        kycStatus: "none",
        points: 20,
        phoneNumber: "+1234567890",
        preferredLanguage: "French",
        country: "CA",
        stateProvince: "Québec",
        ipCity: "Montréal",
        ageGroup: "25-34",
        employmentStatus: "Employed – Full-time",
        monthlyIncome: "$3,000 – $4,999",
        educationLevel: "Bachelor's degree",
        hasCreditCard: true,
        bnplServices: ["Klarna"],
        avgOnlineSpend: "$500 – $999",
        cryptoLevel: "Intermediate",
        walletType: "Metamask",
        portfolioSize: "$1,000 – $9,999",
        favoriteChains: ["Ethereum"],
        mainReason: "Buy Now, Pay Later (BNPL) with crypto",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "test",
        timeToCompletionSeconds: 120,
        experienceBnplRating: 4,
        consentAdult: true,
        consent_data_sharing: true,
        consent_data_sharing_date: new Date(),
        consentMarketing: true,
        signupTimestamp: new Date(),
      });

      const { path: filePath } = await waitlistService.exportWaitlistToCSV();
      const csvContent = fs.readFileSync(filePath, "utf-8");

      expect(csvContent).toContain("Jean-François");
      expect(csvContent).toContain("Dupont");
      expect(csvContent).toContain("Québec");
      expect(csvContent).toContain("Montréal");

      fs.unlinkSync(filePath);
    });

    it("should handle empty values in CSV export", async () => {
      // Create a user with minimal data
      await User.create({
        email: "test@example.com",
        password: "Test123!@#$%",
        firstName: "Test",
        lastName: "User",
        authMethod: "email",
        userReferralCode: "ABC123",
        formFullfilled: true,
        wallets: [],
        kycStatus: "none",
        points: 20,
      });

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
      expect(csvData.userReferralCode).toBe("ABC123");
      expect(csvData.email).toBe("test@example.com");
      expect(csvData.firstName).toBe("Test");
      expect(csvData.phoneNumber).toBe("");

      fs.unlinkSync(filePath);
    });
  });
});
