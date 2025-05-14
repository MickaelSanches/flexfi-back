import express from "express";
import { authLimiter } from "../middlewares/rateLimiter";
import authController from "../controllers/authController";
import { loginUserValidation } from "../validations/userValidation";
import { resetPasswordValidation } from "../validations/resetPaswordValidation";

const router = express.Router();

// Application du rate limiter sur les routes critiques
router.post("/login", authLimiter, authController.login);
router.post("/register", authLimiter, authController.register);
router.post("/reset-password", authLimiter, authController.resetPasswordRequest);
router.post("/reset-password", authLimiter, brevoController.sendPasswordReset);
router.post("/login", authLimiter, loginUserValidation, logFailedLogin, authController.login);

export default router;
