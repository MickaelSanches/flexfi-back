import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import WaitlistUser, { IWaitlistUser } from "../models/WaitlistUser";
import { AppError, ConflictError, InternalError } from "../utils/AppError";

dotenv.config();

export class WaitlistService {
  private EXPORT_DIR: string;

  constructor() {
    this.EXPORT_DIR =
      process.env.EXPORT_DIR || path.join(__dirname, "../../exports");
  }

  // Enregistrer un utilisateur dans la waitlist
  async registerUser(userData: Partial<IWaitlistUser>): Promise<IWaitlistUser> {
    try {
      // vérifier si l'utilisateur est déjà dans la waitlist
      const existingUser = await WaitlistUser.findOne({
        email: userData.email,
      });
      if (existingUser) {
        throw ConflictError("User already registered in the waitlist");
      }
      const newWaitlistUser = new WaitlistUser(userData);
      await newWaitlistUser.save();
      return newWaitlistUser;
    } catch (error) {
      console.error("Error registering user:", error);
      if (error instanceof AppError) throw error;
      if (error instanceof Error) {
        throw InternalError(`Failed to register user: ${error.message}`);
      }
      throw InternalError("Failed to register user");
    }
  }

  // Retourner le nombre total d'utilisateurs dans la waitlist
  async getWaitlistCount(): Promise<number> {
    try {
      const count = await WaitlistUser.countDocuments();
      return count;
    } catch (error: unknown) {
      console.error("Error fetching waitlist count:", error);
      if (error instanceof Error) {
        throw InternalError(`Failed to fetch waitlist count: ${error.message}`);
      }
      throw InternalError("Failed to fetch waitlist count");
    }
  }

  // Récupérer le nombre de parrainages liés à un code
  async getReferralCount(referralCode: string): Promise<number> {
    try {
      const count = await WaitlistUser.countDocuments({ referralCode });
      return count;
    } catch (error: unknown) {
      console.error("Error fetching referral count:", error);
      if (error instanceof Error) {
        throw InternalError(`Failed to fetch referral count: ${error.message}`);
      }
      throw InternalError("Failed to fetch referral count");
    }
  }

  // Fonction pour créer un fichier CSV
  private createCsv(headers: string[], data: any[]): string {
    const headerRow = headers.join(",");
    const rows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header as keyof IWaitlistUser] || "";
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        })
        .join(",")
    );

    return [headerRow, ...rows].join("\n");
  }

  // Exporter les utilisateurs de la waitlist en CSV
  async exportWaitlistToCSV(): Promise<string> {
    try {
      // S'assurer que le dossier d'export existe
      if (!fs.existsSync(this.EXPORT_DIR)) {
        fs.mkdirSync(this.EXPORT_DIR, { recursive: true });
      }

      // Récupérer les utilisateurs de la waitlist depuis la base de données
      const waitlistUsers = await WaitlistUser.find().lean<IWaitlistUser[]>();

      // Définir les en-têtes du fichier CSV
      const headers = [
        "id",
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
        "experienceBnplRating",
        "createdAt",
        "updatedAt",
      ];

      // Formater les données pour correspondre aux en-têtes
      const formattedData = waitlistUsers.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        phoneNumber: user.phoneNumber,
        telegramOrDiscordId: user.telegramOrDiscordId,
        preferredLanguage: user.preferredLanguage,
        country: user.country,
        stateProvince: user.stateProvince,
        ipCity: user.ipCity,
        deviceLocale: user.deviceLocale,
        ageGroup: user.ageGroup,
        employmentStatus: user.employmentStatus,
        monthlyIncome: user.monthlyIncome,
        educationLevel: user.educationLevel,
        hasCreditCard: user.hasCreditCard ? "Yes" : "No",
        bnplServices: user.bnplServices.join(", "),
        avgOnlineSpend: user.avgOnlineSpend,
        cryptoLevel: user.cryptoLevel,
        walletType: user.walletType,
        portfolioSize: user.portfolioSize,
        favoriteChains: user.favoriteChains.join(", "),
        publicWallet: user.publicWallet,
        mainReason: user.mainReason,
        firstPurchase: user.firstPurchase,
        referralCodeUsed: user.referralCodeUsed,
        userReferralCode: user.userReferralCode,
        utmSource: user.utmSource,
        utmMedium: user.utmMedium,
        utmCampaign: user.utmCampaign,
        landingVariant: user.landingVariant,
        deviceType: user.deviceType,
        browser: user.browser,
        signupTimestamp: user.signupTimestamp.toISOString(),
        timeToCompletionSeconds: user.timeToCompletionSeconds.toString(),
        consentMarketing: user.consentMarketing ? "Yes" : "No",
        consentAdult: user.consentAdult ? "Yes" : "No",
        experienceBnplRating: user.experienceBnplRating.toString(),
      }));

      // Générer le contenu CSV
      const csvData = this.createCsv(headers, formattedData);

      // Définir le chemin du fichier CSV
      const filePath = path.join(this.EXPORT_DIR, `waitlist_${Date.now()}.csv`);

      // Écrire les données dans le fichier CSV
      fs.writeFileSync(filePath, csvData);

      return filePath;
    } catch (error: unknown) {
      console.error("Error exporting waitlist to CSV:", error);
      if (error instanceof Error) {
        throw InternalError(
          `Failed to export waitlist to CSV: ${error.message}`
        );
      }
      throw InternalError("Failed to export waitlist to CSV");
    }
  }
}

export default new WaitlistService();
