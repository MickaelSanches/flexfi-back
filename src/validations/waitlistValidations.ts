import { body } from "express-validator";

export const registerWaitlistUserValidation = [
  // Informations de base
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string"),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Invalid phone number format"),
  body("telegramOrDiscordId")
    .notEmpty()
    .withMessage("Telegram or Discord ID is required")
    .isString()
    .withMessage("Telegram or Discord ID must be a string"),
  body("preferredLanguage")
    .notEmpty()
    .withMessage("Preferred language is required")
    .isString()
    .withMessage("Preferred language must be a string"),

  // Localisation
  body("country")
    .notEmpty()
    .withMessage("Country is required")
    .isString()
    .withMessage("Country must be a string"),
  body("stateProvince")
    .notEmpty()
    .withMessage("State/Province is required")
    .isString()
    .withMessage("State/Province must be a string"),
  body("ipCity")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),
  body("deviceLocale")
    .notEmpty()
    .withMessage("Device locale is required")
    .isString()
    .withMessage("Device locale must be a string"),

  // Démographie
  body("ageGroup")
    .notEmpty()
    .withMessage("Age group is required")
    .isIn(["18-24", "25-34", "35-44", "45-54", "55+"])
    .withMessage("Invalid age group"),
  body("employmentStatus")
    .notEmpty()
    .withMessage("Employment status is required")
    .isIn(["employed", "unemployed", "student", "retired"])
    .withMessage("Invalid employment status"),
  body("monthlyIncome")
    .notEmpty()
    .withMessage("Monthly income is required")
    .isIn(["<1000", "1000-3000", "3000-5000", ">5000"])
    .withMessage("Invalid monthly income range"),
  body("educationLevel")
    .notEmpty()
    .withMessage("Education level is required")
    .isIn(["high_school", "bachelor", "master", "phd", "other"])
    .withMessage("Invalid education level"),

  // Informations financières
  body("hasCreditCard")
    .notEmpty()
    .withMessage("Credit card status is required")
    .isBoolean()
    .withMessage("Credit card status must be a boolean"),
  body("bnplServices")
    .notEmpty()
    .withMessage("BNPL services are required")
    .isArray()
    .withMessage("BNPL services must be an array"),
  body("bnplServices.*")
    .isString()
    .withMessage("Each BNPL service must be a string"),
  body("avgOnlineSpend")
    .notEmpty()
    .withMessage("Average online spend is required")
    .isIn(["<100", "100-500", "500-1000", ">1000"])
    .withMessage("Invalid average online spend range"),

  // Crypto
  body("cryptoLevel")
    .notEmpty()
    .withMessage("Crypto level is required")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Invalid crypto level"),
  body("walletType")
    .notEmpty()
    .withMessage("Wallet type is required")
    .isIn(["hot", "cold", "none"])
    .withMessage("Invalid wallet type"),
  body("portfolioSize")
    .notEmpty()
    .withMessage("Portfolio size is required")
    .isIn(["<1000", "1000-10000", "10000-50000", ">50000"])
    .withMessage("Invalid portfolio size"),
  body("favoriteChains")
    .notEmpty()
    .withMessage("Favorite chains are required")
    .isArray()
    .withMessage("Favorite chains must be an array"),
  body("favoriteChains.*")
    .isString()
    .withMessage("Each favorite chain must be a string"),
  body("publicWallet")
    .notEmpty()
    .withMessage("Public wallet is required")
    .isString()
    .withMessage("Public wallet must be a string"),

  // Comportement d'achat
  body("mainReason")
    .notEmpty()
    .withMessage("Main reason is required")
    .isIn(["convenience", "rewards", "budgeting", "other"])
    .withMessage("Invalid main reason"),
  body("firstPurchase")
    .notEmpty()
    .withMessage("First purchase is required")
    .isIn(["<100", "100-500", "500-1000", ">1000"])
    .withMessage("Invalid first purchase range"),

  // Marketing
  body("referralCodeUsed")
    .notEmpty()
    .withMessage("Referral code is required")
    .isString()
    .withMessage("Referral code must be a string"),
  body("userReferralCode")
    .notEmpty()
    .withMessage("User referral code is required")
    .isString()
    .withMessage("User referral code must be a string"),
  body("utmSource")
    .notEmpty()
    .withMessage("UTM source is required")
    .isString()
    .withMessage("UTM source must be a string"),
  body("utmMedium")
    .notEmpty()
    .withMessage("UTM medium is required")
    .isString()
    .withMessage("UTM medium must be a string"),
  body("utmCampaign")
    .notEmpty()
    .withMessage("UTM campaign is required")
    .isString()
    .withMessage("UTM campaign must be a string"),
  body("landingVariant")
    .notEmpty()
    .withMessage("Landing variant is required")
    .isString()
    .withMessage("Landing variant must be a string"),

  // Informations techniques
  body("deviceType")
    .notEmpty()
    .withMessage("Device type is required")
    .isIn(["mobile", "desktop", "tablet"])
    .withMessage("Invalid device type"),
  body("browser")
    .notEmpty()
    .withMessage("Browser is required")
    .isString()
    .withMessage("Browser must be a string"),

  // Métriques
  body("timeToCompletionSeconds")
    .notEmpty()
    .withMessage("Time to completion is required")
    .isInt({ min: 0 })
    .withMessage("Time to completion must be a positive integer"),

  // Consentements
  body("consentMarketing")
    .notEmpty()
    .withMessage("Marketing consent is required")
    .isBoolean()
    .withMessage("Marketing consent must be a boolean"),
  body("consentAdult")
    .notEmpty()
    .withMessage("Adult consent is required")
    .isBoolean()
    .withMessage("Adult consent must be a boolean"),

  // Expérience
  body("experienceBnplRating")
    .notEmpty()
    .withMessage("BNPL experience rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("BNPL experience rating must be between 1 and 5"),
];
