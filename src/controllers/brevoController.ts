import { Request, Response } from "express";
import brevoService from "../services/brevoService";

export class BrevoController {
  async sendVerificationCode(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await brevoService.sendVerificationEmail(email);
      res.status(200).json({ message: "Verification code sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send verification email" });
    }
  }

  async sendPasswordReset(req: Request, res: Response): Promise<void> {
    try {
      const email = req.body.email;
      await brevoService.sendPasswordResetEmail(email);
      res
        .status(200)
        .json({ message: "Password reset email sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send password reset email" });
    }
  }
}

export default new BrevoController();
