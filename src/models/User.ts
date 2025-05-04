import bcrypt from "bcrypt";
import mongoose, { Document, Schema } from "mongoose";

// Interfaces
// What Frontend send to backend Controller at first registering
export interface IBasicUser {
  email: string;
  password: string;
  firstName: string | undefined;
  lastName: string | undefined;
  referralCodeUsed: string | undefined;
}

// What Controller send to Service
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string | undefined;
  lastName: string | undefined;
  referralCodeUsed: string | undefined;
  userReferralCode: string;
  authMethod: "email" | "google" | "apple" | "twitter";
  googleId: string | undefined;
  appleId: string | undefined;
  twitterId: string | undefined;
  wallets: IWallet[];
  kycStatus: "none" | "pending" | "approved" | "rejected";
  kycId: string | undefined;
  selectedCard: string | undefined;
  formFullfilled: boolean;
  points: number;
  deviceType: string | undefined;
  browser: string | undefined;
  ipCity: string | undefined;
  deviceLocale: string | undefined;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// What Backend send to Frontend
export interface IWallet {
  publicKey: string;
  type: "connected" | "created";
  hasDelegation: boolean;
  delegationExpiry?: Date;
}

// What Frontend send to backend at waitlist form
export interface IWaitlistFormData {
  email: string;
  phoneNumber: string | undefined;
  telegramOrDiscordId: string | undefined;
  preferredLanguage: string;
  country: string;
  stateProvince: string;
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
  publicWallet: string | undefined;
  mainReason: string;
  firstPurchase: string | undefined;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  timeToCompletionSeconds: number;
  experienceBnplRating: number;
  consentAdult: boolean;
  consent_data_sharing: boolean;
  consent_data_sharing_date: Date;
  consentMarketing: boolean;
  signupTimestamp: Date;
}

// What Waitlist Controller send to Waitlist Service
export interface IWaitlistUser {
  email: string;
  formData: {
    phoneNumber: string | undefined;
    telegramOrDiscordId: string | undefined;
    preferredLanguage: string;
    country: string;
    stateProvince: string;
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
    publicWallet: string | undefined;
    mainReason: string;
    firstPurchase: string | undefined;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    timeToCompletionSeconds: number;
    experienceBnplRating: number;
    consentAdult: boolean;
    consent_data_sharing: boolean;
    consent_data_sharing_date: Date;
    consentMarketing: boolean;
    signupTimestamp: Date;
  };
}

// What Waitlist Service send to Export
export interface IUserDataToExport extends Document {
  email: string;
  password: string;
  firstName: string | undefined;
  lastName: string | undefined;
  referralCodeUsed: string | undefined;
  userReferralCode: string;
  authMethod: "email" | "google" | "apple" | "twitter";
  googleId: string | undefined;
  appleId: string | undefined;
  twitterId: string | undefined;
  wallets: IWallet[];
  kycStatus: "none" | "pending" | "approved" | "rejected";
  kycId: string | undefined;
  selectedCard: string | undefined;
  formFullfilled: boolean;
  points: number;
  deviceType: string;
  browser: string;
  ipCity: string;
  deviceLocale: string;
  phoneNumber: string | undefined;
  telegramOrDiscordId: string | undefined;
  preferredLanguage: string;
  country: string;
  stateProvince: string;
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
  publicWallet: string | undefined;
  mainReason: string;
  firstPurchase: string | undefined;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  timeToCompletionSeconds: number;
  experienceBnplRating: number;
  consentAdult: boolean;
  consent_data_sharing: boolean;
  consent_data_sharing_date: Date;
  consentMarketing: boolean;
  signupTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Schema in database
const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    password: { type: String, required: true },
    referralCodeUsed: { type: String, required: false },
    userReferralCode: { type: String, required: true },
    authMethod: {
      type: String,
      enum: ["email", "google", "apple", "twitter"],
      required: true,
    },
    googleId: { type: String, required: false },
    appleId: { type: String, required: false },
    twitterId: { type: String, required: false },
    wallets: [
      {
        publicKey: { type: String, required: true },
        type: { type: String, enum: ["connected", "created"], required: true },
        hasDelegation: { type: Boolean, required: true, default: false },
        delegationExpiry: { type: Date, required: false },
      },
    ],
    kycStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      required: true,
      default: "none",
    },
    kycId: { type: String, required: false },
    selectedCard: { type: String, required: false },
    formFullfilled: { type: Boolean, required: true, default: false },
    points: { type: Number, required: true, default: 0 },
    deviceType: { type: String, required: false },
    browser: { type: String, required: false },
    ipCity: { type: String, required: false },
    deviceLocale: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    telegramOrDiscordId: { type: String, required: false },
    preferredLanguage: { type: String, required: false },
    country: { type: String, required: false },
    stateProvince: { type: String, required: false },
    ageGroup: { type: String, required: false },
    employmentStatus: { type: String, required: false },
    monthlyIncome: { type: String, required: false },
    educationLevel: { type: String, required: false },
    hasCreditCard: { type: Boolean, required: false },
    bnplServices: { type: [String], required: false },
    avgOnlineSpend: { type: String, required: false },
    cryptoLevel: { type: String, required: false },
    walletType: { type: String, required: false },
    portfolioSize: { type: String, required: false },
    favoriteChains: { type: [String], required: false },
    publicWallet: { type: String, required: false },
    mainReason: { type: String, required: false },
    firstPurchase: { type: String, required: false },
    utmSource: { type: String, required: false },
    utmMedium: { type: String, required: false },
    utmCampaign: { type: String, required: false },
    timeToCompletionSeconds: { type: Number, required: false },
    experienceBnplRating: { type: Number, required: false },
    consentAdult: { type: Boolean, required: false },
    consent_data_sharing: { type: Boolean, required: false },
    consent_data_sharing_date: { type: Date, required: false },
    consentMarketing: { type: Boolean, required: false },
    signupTimestamp: { type: Date, required: false },
  },
  { timestamps: true }
);

// Middleware pour hasher le mot de passe avant l'enregistrement
UserSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password") && this.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error: any) {
      next(error);
    }
  } else {
    next();
  }
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Export du modèle
const User = mongoose.model<IUser>("User", UserSchema);

// Exports
export { User, UserSchema };
