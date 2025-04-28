import { Router } from "express";
import waitlistController from "../controllers/waitlistController";
import { adminOnly } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validationMiddleware";
import { registerWaitlistUserValidation } from "../validations/waitlistValidations";

const router = Router();

// Route pour enregistrer un utilisateur dans la waitlist
router.post(
  "/",
  validate(registerWaitlistUserValidation),
  waitlistController.registerUser
);

// Route pour retourner le nombre total d'utilisateurs dans la waitlist
router.get("/count", waitlistController.getWaitlistCount);

// Route pour récupérer les parrainages liés à un code
router.get("/referral/:code", waitlistController.getReferralCount);

// Route pour exporter les utilisateurs de la waitlist (admin uniquement)
router.get("/export", adminOnly, waitlistController.exportWaitlist);

export default router;
