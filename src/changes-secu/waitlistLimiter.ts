//Appliquer le Rate Limiting sur les routes Waitlist

import rateLimit from "express-rate-limit";
import logger from "../utils/logger";

export const waitlistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limite à 10 requêtes par IP
  message: "Too many requests to the waitlist. Please try again later.",
  handler: (req, res) => {
    logger.warn(`Waitlist rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Too many requests to the waitlist. Please try again later.",
    });
  },
});
