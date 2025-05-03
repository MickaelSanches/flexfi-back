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
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String, required: true },
    referralCodeUsed: { type: String },
    userReferralCode: { type: String },

    authMethod: {
      type: String,
      enum: ["email", "google", "apple", "twitter"],
      required: true,
    },

    googleId: { type: String },
    appleId: { type: String },
    twitterId: { type: String },

    wallets: [
      {
        publicKey: { type: String },
        type: { type: String, enum: ["connected", "created"] },
        hasDelegation: { type: Boolean, default: false },
        delegationExpiry: { type: Date },
      },
    ],

    kycStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    kycId: { type: String },
    selectedCard: { type: String },

    formFullfilled: { type: Boolean, default: false },
    points: { type: Number, default: 0 },

    deviceType: { type: String },
    browser: { type: String },
    ipCity: { type: String },
    deviceLocale: { type: String },

    // Champs waitlist (tous facultatifs)
    phoneNumber: { type: String },
    telegramOrDiscordId: { type: String },
    preferredLanguage: { type: String },
    country: { type: String },
    stateProvince: { type: String },
    ageGroup: { type: String },
    employmentStatus: { type: String },
    monthlyIncome: { type: String },
    educationLevel: { type: String },
    hasCreditCard: { type: Boolean },
    bnplServices: { type: [String] },
    avgOnlineSpend: { type: String },
    cryptoLevel: { type: String },
    walletType: { type: String },
    portfolioSize: { type: String },
    favoriteChains: { type: [String] },
    publicWallet: { type: String },
    mainReason: { type: String },
    firstPurchase: { type: String },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    timeToCompletionSeconds: { type: Number },
    experienceBnplRating: { type: Number },
    consentAdult: { type: Boolean },
    consent_data_sharing: { type: Boolean },
    consent_data_sharing_date: { type: Date },
    consentMarketing: { type: Boolean },
    signupTimestamp: { type: Date },
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
