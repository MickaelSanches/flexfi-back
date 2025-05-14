import rateLimit from "express-rate-limit";
import logger from "../utils/logger";

// Rate Limiter Global - 100 requêtes max / 15 min par IP
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par IP
  message: "Too many requests. Please try again later.",
  handler: (req, res) => {
    logger.warn(`Global rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});
