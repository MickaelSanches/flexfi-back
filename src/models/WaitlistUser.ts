import mongoose, { Document, Schema } from "mongoose";

export interface WaitlistFormData {
  email: string;
  firstName: string;
  phoneNumber?: string;
  telegramOrDiscordId?: string;
  preferredLanguage: string;
  country: string;
  stateProvince: string;
  ipCity?: string;
  deviceLocale?: string;
  ageGroup: string;
  employmentStatus: string;
  monthlyIncome: string;
  educationLevel: string;
  hasCreditCard: boolean;
  bnplServices: string[];
  avgOnlineSpend: string;
  cryptoLevel: string;
  walletType: string;
  portfolioSize: string;
  favoriteChains: string[];
  publicWallet?: string;
  mainReason: string;
  firstPurchase?: string;
  referralCodeUsed?: string;
  userReferralCode?: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  landingVariant: string;
  deviceType?: string;
  browser?: string;
  timeToCompletionSeconds: number;
  consentMarketing: boolean;
  consentAdult: boolean;
  experienceBnplRating: number;
}

export interface IWaitlistUser extends Document {
  email: string;
  firstName: string;
  phoneNumber?: string;
  telegramOrDiscordId?: string;
  preferredLanguage: string;
  country: string;
  stateProvince: string;
  ipCity?: string;
  deviceLocale?: string;
  ageGroup: string;
  employmentStatus: string;
  monthlyIncome: string;
  educationLevel: string;
  hasCreditCard: boolean;
  bnplServices: string[];
  avgOnlineSpend: string;
  cryptoLevel: string;
  walletType: string;
  portfolioSize: string;
  favoriteChains: string[];
  publicWallet?: string;
  mainReason: string;
  firstPurchase?: string;
  referralCodeUsed?: string;
  userReferralCode?: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  landingVariant: string;
  deviceType?: string;
  browser?: string;
  signupTimestamp: Date;
  timeToCompletionSeconds: number;
  consentMarketing: boolean;
  consentAdult: boolean;
  consent_data_sharing: boolean;
  consent_data_sharing_date: Date;
  experienceBnplRating: number;
}

const WaitlistUserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    telegramOrDiscordId: { type: String, required: false },
    preferredLanguage: { type: String, required: true },
    country: { type: String, required: true },
    stateProvince: { type: String, required: true },
    ipCity: { type: String, required: false },
    deviceLocale: { type: String, required: false },
    ageGroup: { type: String, required: true },
    employmentStatus: { type: String, required: true },
    monthlyIncome: { type: String, required: true },
    educationLevel: { type: String, required: true },
    hasCreditCard: { type: Boolean, required: true },
    bnplServices: { type: [String], required: true },
    avgOnlineSpend: { type: String, required: true },
    cryptoLevel: { type: String, required: true },
    walletType: { type: String, required: true },
    portfolioSize: { type: String, required: true },
    favoriteChains: { type: [String], required: true },
    publicWallet: { type: String, required: false },
    mainReason: { type: String, required: true },
    firstPurchase: { type: String, required: false },
    referralCodeUsed: { type: String, required: false },
    userReferralCode: { type: String, required: false },
    utmSource: { type: String, required: true },
    utmMedium: { type: String, required: true },
    utmCampaign: { type: String, required: true },
    landingVariant: { type: String, required: true },
    deviceType: { type: String, required: false },
    browser: { type: String, required: false },
    signupTimestamp: { type: Date, default: Date.now, required: true },
    timeToCompletionSeconds: { type: Number, required: true },
    consentMarketing: { type: Boolean, required: true },
    consentAdult: { type: Boolean, required: true },
    consent_data_sharing: { type: Boolean, required: true },
    consent_data_sharing_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    experienceBnplRating: { type: Number, required: true },
  },
  { timestamps: true }
);

WaitlistUserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model<IWaitlistUser>(
  "WaitlistUser",
  WaitlistUserSchema
);
