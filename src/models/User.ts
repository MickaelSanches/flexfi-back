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
    signupTimeStamp: Date;
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
    firstName: { type: String, required: true, default: undefined },
    lastName: { type: String, required: true, default: undefined },
    password: { type: String, required: true },
    referralCodeUsed: { type: String, required: true, default: undefined },
    userReferralCode: { type: String, required: true },
    authMethod: {
      type: String,
      enum: ["email", "google", "apple", "twitter"],
      required: true,
    },
    googleId: { type: String, required: true, default: undefined },
    appleId: { type: String, required: true, default: undefined },
    twitterId: { type: String, required: true, default: undefined },
    wallets: [
      {
        publicKey: { type: String, required: true },
        type: { type: String, enum: ["connected", "created"], required: true },
        hasDelegation: { type: Boolean, required: true, default: false },
        delegationExpiry: { type: Date, required: true, default: undefined },
      },
    ],
    kycStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      required: true,
      default: "none",
    },
    kycId: { type: String, required: true, default: undefined },
    selectedCard: { type: String, required: true, default: undefined },
    formFullfilled: { type: Boolean, required: true, default: false },
    points: { type: Number, required: true, default: 0 },
    deviceType: { type: String, required: true, default: undefined },
    browser: { type: String, required: true, default: undefined },
    ipCity: { type: String, required: true, default: undefined },
    deviceLocale: { type: String, required: true, default: undefined },
    phoneNumber: { type: String, required: true, default: undefined },
    telegramOrDiscordId: { type: String, required: true, default: undefined },
    preferredLanguage: { type: String, required: true, default: undefined },
    country: { type: String, required: true, default: undefined },
    stateProvince: { type: String, required: true, default: undefined },
    ageGroup: { type: String, required: true, default: undefined },
    employmentStatus: { type: String, required: true, default: undefined },
    monthlyIncome: { type: String, required: true, default: undefined },
    educationLevel: { type: String, required: true, default: undefined },
    hasCreditCard: { type: Boolean, required: true, default: undefined },
    bnplServices: { type: [String], required: true, default: undefined },
    avgOnlineSpend: { type: String, required: true, default: undefined },
    cryptoLevel: { type: String, required: true, default: undefined },
    walletType: { type: String, required: true, default: undefined },
    portfolioSize: { type: String, required: true, default: undefined },
    favoriteChains: { type: [String], required: true, default: undefined },
    publicWallet: { type: String, required: true, default: undefined },
    mainReason: { type: String, required: true, default: undefined },
    firstPurchase: { type: String, required: true, default: undefined },
    utmSource: { type: String, required: true, default: undefined },
    utmMedium: { type: String, required: true, default: undefined },
    utmCampaign: { type: String, required: true, default: undefined },
    timeToCompletionSeconds: {
      type: Number,
      required: true,
      default: undefined,
    },
    experienceBnplRating: { type: Number, required: true, default: undefined },
    consentAdult: { type: Boolean, required: true, default: undefined },
    consent_data_sharing: { type: Boolean, required: true, default: undefined },
    consent_data_sharing_date: {
      type: Date,
      required: true,
      default: undefined,
    },
    consentMarketing: { type: Boolean, required: true, default: undefined },
    signupTimestamp: { type: Date, required: true, default: undefined },
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
