import { body } from "express-validator";

export const registerWaitlistUserValidation = [
  // Basic information
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
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Invalid phone number format"),
  body("telegramOrDiscordId")
    .optional()
    .isString()
    .withMessage("Telegram or Discord ID must be a string"),
  body("preferredLanguage")
    .notEmpty()
    .withMessage("Preferred language is required")
    .isIn(["English", "French", "Spanish", "Portuguese"])
    .withMessage("Invalid preferred language"),

  // Location
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

  // Demographics
  body("ageGroup")
    .notEmpty()
    .withMessage("Age group is required")
    .isIn(["18-29", "30-44", "45-59", "60+"])
    .withMessage("Invalid age group"),
  body("employmentStatus")
    .notEmpty()
    .withMessage("Employment status is required")
    .isIn([
      "Employed – Full-time",
      "Employed – Part-time",
      "Self-employed / Freelancer",
      "Entrepreneur / Business Owner",
      "Student",
      "Intern / Apprentice",
      "Unemployed – Seeking work",
      "Unemployed – Not seeking work",
      "Retired",
      "Homemaker / Caregiver",
      "Gig Worker / Platform Worker",
      "Informal Sector Worker",
      "Government / Public Sector Employee",
      "Other",
    ])
    .withMessage("Invalid employment status"),
  body("monthlyIncome")
    .notEmpty()
    .withMessage("Monthly income is required")
    .isIn([
      "Less than $1,500",
      "$1,500 – $1,999",
      "$2,000 – $2,999",
      "$3,000 – $4,999",
      "$5,000 – $9,999",
      "$10,000 or more",
    ])
    .withMessage("Invalid monthly income range"),
  body("educationLevel")
    .notEmpty()
    .withMessage("Education level is required")
    .isIn([
      "No formal education",
      "Primary school / Elementary education",
      "Secondary school / High school diploma",
      "Vocational / Technical training",
      "Some college / University (no degree yet)",
      "Bachelor's degree (BA, BS, etc.)",
      "Master's degree (MA, MSc, MBA, etc.)",
      "Doctorate / PhD",
      "Other",
    ])
    .withMessage("Invalid education level"),

  // Financial information
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
    .isIn([
      "Klarna",
      "Afterpay",
      "Affirm",
      "Zip (Quadpay)",
      "Sezzle",
      "Alma",
      "Oney",
      "Nelo",
      "Kueski Pay",
      "Mercado Crédito",
      "Aplazo",
      "Other",
      "None",
    ])
    .withMessage("Invalid BNPL service"),
  body("avgOnlineSpend")
    .notEmpty()
    .withMessage("Average online spend is required")
    .isIn([
      "Less than $50",
      "$50 – $99",
      "$100 – $199",
      "$200 – $399",
      "$400 – $699",
      "$700 – $999",
      "$1,000 – $1,499",
      "$1,500 – $1,999",
      "$2,000 or more",
    ])
    .withMessage("Invalid average online spend range"),

  // Crypto
  body("cryptoLevel")
    .notEmpty()
    .withMessage("Crypto level is required")
    .isIn(["Zero", "Beginner", "Intermediate", "Active User", "Crypto Native"])
    .withMessage("Invalid crypto level"),
  body("walletType")
    .notEmpty()
    .withMessage("Wallet type is required")
    .isIn([
      "Phantom",
      "Solflare",
      "Jupiter",
      "Backpack",
      "Magic Eden",
      "Trust Wallet",
      "Metamask",
      "Rabby Wallet",
      "Uniswap",
      "Other",
    ])
    .withMessage("Invalid wallet type"),
  body("portfolioSize")
    .notEmpty()
    .withMessage("Portfolio size is required")
    .isIn([
      "Less than $1,000",
      "$1,000 – $9,999",
      "$10,000 – $49,999",
      "$50,000 or more",
    ])
    .withMessage("Invalid portfolio size"),
  body("favoriteChains")
    .notEmpty()
    .withMessage("Favorite chains are required")
    .isArray()
    .withMessage("Favorite chains must be an array"),
  body("favoriteChains.*")
    .isIn([
      "Solana",
      "Ethereum",
      "Binance Smart Chain (BSC)",
      "Polygon",
      "Avalanche",
      "Arbitrum",
      "Optimism",
      "Base",
      "Fantom",
      "Near",
      "Cosmos",
      "Cardano",
      "Bitcoin",
      "Other",
    ])
    .withMessage("Invalid favorite chain"),
  body("publicWallet")
    .optional()
    .isString()
    .withMessage("Public wallet must be a string"),

  // Purchase behavior
  body("mainReason")
    .notEmpty()
    .withMessage("Main reason is required")
    .isIn([
      "Buy Now, Pay Later (BNPL) with crypto",
      "Earn yield or rewards on purchases",
      "Use a crypto-powered payment card",
      "Get early access to FlexFi features",
      "Access financial services without a bank",
      "Join a crypto-native financial community",
      "Receive cashback",
      "Learn about FlexFi / stay informed",
      "Other",
    ])
    .withMessage("Invalid main reason"),
  body("firstPurchase")
    .optional()
    .isString()
    .withMessage("First purchase must be a string"),

  // Marketing
  body("referralCodeUsed")
    .optional()
    .isString()
    .withMessage("Referral code must be a string"),
  body("userReferralCode")
    .optional()
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

  // Metrics
  body("timeToCompletionSeconds")
    .notEmpty()
    .withMessage("Time to completion is required")
    .isInt({ min: 0 })
    .withMessage("Time to completion must be a positive integer"),

  // Consents
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
  body("consent_data_sharing")
    .notEmpty()
    .withMessage("Data sharing consent is required")
    .isBoolean()
    .withMessage("Data sharing consent must be a boolean"),
  body("consent_data_sharing_date")
    .notEmpty()
    .withMessage("Data sharing consent date is required")
    .isISO8601()
    .withMessage("Data sharing consent date must be a valid ISO date"),

  // Experience
  body("experienceBnplRating")
    .notEmpty()
    .withMessage("BNPL experience rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("BNPL experience rating must be between 1 and 5"),
];
