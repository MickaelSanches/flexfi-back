import { body } from "express-validator/lib/middlewares/validation-chain-builders";

export const registerWaitlistUserValidation = [
  // Basic information
  body("email")
    .notEmpty()
    .withMessage("Please enter your email address")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("phoneNumber")
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Please enter a valid phone number"),
  body("telegramOrDiscordId")
    .optional()
    .isString()
    .withMessage("Please enter a valid Telegram or Discord ID"),
  body("preferredLanguage")
    .notEmpty()
    .withMessage("Please select your preferred language")
    .isIn(["English", "French", "Spanish", "Portuguese"])
    .withMessage("This language is not available"),

  // Location
  body("country")
    .notEmpty()
    .withMessage("Please select your country")
    .isString()
    .withMessage("Please select a valid country"),
  body("stateProvince")
    .notEmpty()
    .withMessage("Please enter your state/province")
    .isString()
    .withMessage("Please enter a valid state/province"),

  // Demographics
  body("ageGroup")
    .notEmpty()
    .withMessage("Please select your age group")
    .isIn(["18-29", "30-44", "45-59", "60+"])
    .withMessage("Please select a valid age group"),
  body("employmentStatus")
    .notEmpty()
    .withMessage("Please select your employment status")
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
    .withMessage("Please select a valid employment status"),
  body("monthlyIncome")
    .notEmpty()
    .withMessage("Please select your monthly income")
    .isIn([
      "Less than $1,500",
      "$1,500 – $1,999",
      "$2,000 – $2,999",
      "$3,000 – $4,999",
      "$5,000 – $9,999",
      "$10,000 or more",
    ])
    .withMessage("Please select a valid income range"),
  body("educationLevel")
    .notEmpty()
    .withMessage("Please select your education level")
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
    .withMessage("Please select a valid education level"),

  // Financial information
  body("hasCreditCard")
    .notEmpty()
    .withMessage("Please indicate if you have a credit card")
    .isBoolean()
    .withMessage("Please select yes or no"),
  body("bnplServices")
    .notEmpty()
    .withMessage("Please select at least one BNPL service")
    .isArray()
    .withMessage("Please select at least one BNPL service")
    .custom((value) => value.length > 0)
    .withMessage("Please select at least one BNPL service"),
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
    .withMessage("Please select valid BNPL services"),
  body("avgOnlineSpend")
    .notEmpty()
    .withMessage("Please select your average online spending")
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
    .withMessage("Please select a valid spending range"),

  // Crypto
  body("cryptoLevel")
    .notEmpty()
    .withMessage("Please select your crypto experience level")
    .isIn(["Zero", "Beginner", "Intermediate", "Active User", "Crypto Native"])
    .withMessage("Please select a valid experience level"),
  body("walletType")
    .notEmpty()
    .withMessage("Please select your wallet type")
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
    .withMessage("Please select a valid wallet type"),
  body("portfolioSize")
    .notEmpty()
    .withMessage("Please select your portfolio size")
    .isIn([
      "Less than $1,000",
      "$1,000 – $9,999",
      "$10,000 – $49,999",
      "$50,000 or more",
    ])
    .withMessage("Please select a valid portfolio size"),
  body("favoriteChains")
    .notEmpty()
    .withMessage("Please select at least one blockchain")
    .isArray()
    .withMessage("Please select at least one blockchain")
    .custom((value) => value.length > 0)
    .withMessage("Please select at least one blockchain"),
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
    .withMessage("Please select valid blockchains"),
  body("publicWallet")
    .optional()
    .isString()
    .withMessage("Please enter a valid wallet address"),

  // Purchase behavior
  body("mainReason")
    .notEmpty()
    .withMessage("Please select your main reason for joining")
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
    .withMessage("Please select a valid reason"),
  body("firstPurchase")
    .optional()
    .isString()
    .withMessage("Le montant du premier achat n'est pas valide"),

  // Marketing
  body("referralCodeUsed")
    .optional()
    .isString()
    .withMessage("Le code de parrainage n'est pas valide"),
  body("userReferralCode")
    .optional()
    .isString()
    .withMessage("Le code de parrainage utilisateur n'est pas valide"),
  body("utmSource")
    .notEmpty()
    .withMessage("La source UTM est requise")
    .isString()
    .withMessage("La source UTM n'est pas valide"),
  body("utmMedium")
    .notEmpty()
    .withMessage("Le medium UTM est requis")
    .isString()
    .withMessage("Le medium UTM n'est pas valide"),
  body("utmCampaign")
    .notEmpty()
    .withMessage("La campagne UTM est requise")
    .isString()
    .withMessage("La campagne UTM n'est pas valide"),

  // Metrics
  body("timeToCompletionSeconds")
    .notEmpty()
    .withMessage("Time to completion is required")
    .isInt({ min: 0 })
    .withMessage("Time to completion must be positive"),

  // Consents
  body("consentMarketing")
    .notEmpty()
    .withMessage("Please indicate your marketing preferences")
    .isBoolean()
    .withMessage("Please select yes or no"),
  body("consentAdult")
    .notEmpty()
    .withMessage("Please confirm you are over 18")
    .isBoolean()
    .withMessage("Please select yes or no"),
  body("consent_data_sharing")
    .notEmpty()
    .withMessage("Please accept data sharing")
    .isBoolean()
    .withMessage("Please select yes or no"),
  body("consent_data_sharing_date")
    .notEmpty()
    .withMessage("Acceptance date is required")
    .isISO8601()
    .withMessage("Please provide a valid date"),

  // Experience
  body("experienceBnplRating")
    .notEmpty()
    .withMessage("Please rate your BNPL experience")
    .isInt({ min: 1, max: 5 })
    .withMessage("Please rate between 1 and 5"),

  // Timestamp
  body("signupTimestamp")
    .notEmpty()
    .withMessage("Signup date is required")
    .isISO8601()
    .withMessage("Please provide a valid date"),
];
