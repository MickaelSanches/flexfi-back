import { Router } from "express";
import passport from "passport";
import authController from "../controllers/authController";
import brevoController from "../controllers/brevoController";
import { authenticate } from "../middlewares/authMiddleware";
import { resetPasswordValidation } from "../validations/resetPaswordValidation";
import { registerUserValidation } from "../validations/userValidation";
import { authLimiter } from "../middlewares/rateLimiter";
import { logFailedLogin } from "../middlewares/logFailedLogin";

const router = Router();


// Inscription avec rate limiter et validation
router.post("/register", authLimiter, registerUserValidation, authController.register);

// Connexion avec rate limiter, logging des tentatives échouées
router.post("/login", authLimiter, logFailedLogin, authController.login);

// Récupérer le profil utilisateur
router.get("/me", authenticate, authController.getCurrentUser);

//#TODO //OAuth (res ?) 

// Réinitialisation du mot de passe
router.post("/reset-password", authLimiter, brevoController.sendPasswordReset);
router.post("/verify-reset-password", authLimiter, resetPasswordValidation, authController.verifyResetPassword);

export default router;
