import mongoose, { Schema, Document } from "mongoose";

export interface IWaitlistUser extends Document {
  email: string;
  firstName: string;
  phoneNumber: string;
  telegramOrDiscordId: string;
  preferredLanguage: string;
  country: string;
  stateProvince: string;
  ipCity: string;
  deviceLocale: string;
  ageGroup: string;
  employmentStatus: string;
  monthlyIncome: string;
  educationLevel: string;
  hasCreditCard: boolean;
  bnplServices: string[]; // Array of strings
  avgOnlineSpend: string;
  cryptoLevel: string;
  walletType: string;
  portfolioSize: string;
  favoriteChains: string[]; // Array of strings
  publicWallet: string;
  mainReason: string;
  firstPurchase: string;
  referralCodeUsed: string;
  userReferralCode: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  landingVariant: string;
  deviceType: string;
  browser: string;
  signupTimestamp: Date; // TIMESTAMP
  timeToCompletionSeconds: number; // INT
  consentMarketing: boolean;
  consentAdult: boolean;
  experienceBnplRating: number; // INT
}

const WaitlistUserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    telegramOrDiscordId: { type: String, required: true },
    preferredLanguage: { type: String, required: true },
    country: { type: String, required: true },
    stateProvince: { type: String, required: true },
    ipCity: { type: String, required: true },
    deviceLocale: { type: String, required: true },
    ageGroup: { type: String, required: true },
    employmentStatus: { type: String, required: true },
    monthlyIncome: { type: String, required: true },
    educationLevel: { type: String, required: true },
    hasCreditCard: { type: Boolean, required: true },
    bnplServices: { type: [String], required: true }, // Array of strings
    avgOnlineSpend: { type: String, required: true },
    cryptoLevel: { type: String, required: true },
    walletType: { type: String, required: true },
    portfolioSize: { type: String, required: true },
    favoriteChains: { type: [String], required: true }, // Array of strings
    publicWallet: { type: String, required: true },
    mainReason: { type: String, required: true },
    firstPurchase: { type: String, required: true },
    referralCodeUsed: { type: String, required: true },
    userReferralCode: { type: String, required: true },
    utmSource: { type: String, required: true },
    utmMedium: { type: String, required: true },
    utmCampaign: { type: String, required: true },
    landingVariant: { type: String, required: true },
    deviceType: { type: String, required: true },
    browser: { type: String, required: true },
    signupTimestamp: { type: Date, default: Date.now, required: true }, // TIMESTAMP
    timeToCompletionSeconds: { type: Number, required: true }, // INT
    consentMarketing: { type: Boolean, required: true },
    consentAdult: { type: Boolean, required: true },
    experienceBnplRating: { type: Number, required: true }, // INT
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export default mongoose.model<IWaitlistUser>(
  "WaitlistUser",
  WaitlistUserSchema
);
