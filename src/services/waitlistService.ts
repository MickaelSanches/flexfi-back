import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import WaitlistUser, {
  IWaitlistUser,
  WaitlistFormData,
} from "../models/WaitlistUser";
import { InternalError } from "../utils/AppError";

dotenv.config();

// Directory to store CSV files
const EXPORT_DIR = path.join(__dirname, "../../exports");

// Function to create a simple CSV
function createCsv(headers: string[], data: any[]): string {
  const headerRow = headers.join(",");
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header] || "";
        // If value contains a comma, wrap it in quotes
        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : value;
      })
      .join(",")
  );

  return [headerRow, ...rows].join("\n");
}

export class WaitlistService {
  // Register a new user in the waitlist
  async registerUser(userData: WaitlistFormData): Promise<IWaitlistUser> {
    try {
      const newUser = new WaitlistUser({
        ...userData,
        signupTimestamp: new Date(),
      });

      return await newUser.save();
    } catch (error: any) {
      throw error;
    }
  }

  // Get total number of users in the waitlist
  async getWaitlistCount(): Promise<number> {
    try {
      return await WaitlistUser.countDocuments();
    } catch (error) {
      throw InternalError("Failed to get waitlist count");
    }
  }

  // Get number of referrals linked to a code
  async getReferralCount(referralCode: string): Promise<number> {
    try {
      const count = await WaitlistUser.countDocuments({
        userReferralCode: referralCode,
      });
      return count;
    } catch (error: unknown) {
      console.error("Error fetching referral count:", error);
      if (error instanceof Error) {
        throw InternalError(`Failed to fetch referral count: ${error.message}`);
      }
      throw InternalError("Failed to fetch referral count");
    }
  }

  // Export waitlist to CSV file
  async exportWaitlistToCSV(): Promise<string> {
    try {
      if (!fs.existsSync(EXPORT_DIR)) {
        fs.mkdirSync(EXPORT_DIR, { recursive: true });
      }

      const users = await WaitlistUser.find().lean<IWaitlistUser[]>();
      const dateStr = new Date().toISOString().split("T")[0];
      const filePath = path.join(EXPORT_DIR, `waitlist_${dateStr}.csv`);

      const headers = [
        "email",
        "firstName",
        "phoneNumber",
        "telegramOrDiscordId",
        "preferredLanguage",
        "country",
        "stateProvince",
        "ipCity",
        "deviceLocale",
        "ageGroup",
        "employmentStatus",
        "monthlyIncome",
        "educationLevel",
        "hasCreditCard",
        "bnplServices",
        "avgOnlineSpend",
        "cryptoLevel",
        "walletType",
        "portfolioSize",
        "favoriteChains",
        "publicWallet",
        "mainReason",
        "firstPurchase",
        "referralCodeUsed",
        "userReferralCode",
        "utmSource",
        "utmMedium",
        "utmCampaign",
        "landingVariant",
        "deviceType",
        "browser",
        "signupTimestamp",
        "timeToCompletionSeconds",
        "consentMarketing",
        "consentAdult",
        "consent_data_sharing",
        "consent_data_sharing_date",
        "experienceBnplRating",
      ];

      const formattedData = users.map((user) => {
        const formattedUser: Record<string, string> = {};

        headers.forEach((header) => {
          formattedUser[header] = "";
        });

        if (user.bnplServices)
          formattedUser.bnplServices = user.bnplServices.join(", ");
        if (user.favoriteChains)
          formattedUser.favoriteChains = user.favoriteChains.join(", ");
        if (user.signupTimestamp)
          formattedUser.signupTimestamp = user.signupTimestamp.toISOString();
        if (user.consent_data_sharing_date)
          formattedUser.consent_data_sharing_date =
            user.consent_data_sharing_date.toISOString();
        if (user.timeToCompletionSeconds)
          formattedUser.timeToCompletionSeconds =
            user.timeToCompletionSeconds.toString();
        if (user.experienceBnplRating)
          formattedUser.experienceBnplRating =
            user.experienceBnplRating.toString();

        Object.entries(user).forEach(([key, value]) => {
          if (
            ![
              "bnplServices",
              "favoriteChains",
              "signupTimestamp",
              "consent_data_sharing_date",
              "timeToCompletionSeconds",
              "experienceBnplRating",
              "_id",
              "__v",
              "createdAt",
              "updatedAt",
            ].includes(key)
          ) {
            formattedUser[key] = value?.toString() || "";
          }
        });

        return formattedUser;
      });

      const csvData = createCsv(headers, formattedData);
      fs.writeFileSync(filePath, csvData);
      return filePath;
    } catch (error) {
      throw InternalError("Failed to export waitlist to CSV");
    }
  }
}

export default new WaitlistService();
