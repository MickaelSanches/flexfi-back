import { NextFunction, Request, Response } from "express";
import { zealyConfig } from "../config/zealy";
import { UserDocument } from "../models/User";
import zealyService from "../services/zealyService";
import logger from "../utils/logger";

export class ZealyController {
  // Rediriger vers la page de connexion Zealy
  async connect(req: Request, res: Response): Promise<void> {
    const authUrl = `${zealyConfig.apiUrl}/communities/${zealyConfig.communityId}/join`;
    res.redirect(authUrl);
  }

  // Gérer le callback de Zealy
  async callback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req.user as UserDocument)?._id;
      if (!userId) {
        res.status(400).json({ error: "User not authenticated" });
        return;
      }

      const verificationCode = req.query.code;
      if (!verificationCode) {
        res.status(400).json({ error: "Verification code is required" });
        return;
      }

      const user = await zealyService.verifyAndUpdateUser(
        userId.toString(),
        verificationCode as string
      );

      res.json({
        success: true,
        points: {
          zealy: user.flexpoints_zealy,
          total: user.flexpoints_total,
        },
        discord_handle: user.discord_handle,
      });
    } catch (error: any) {
      logger.error("Zealy callback error:", error);
      res.status(error.response?.status || 500).json({
        error:
          error.response?.data?.message || "Failed to connect Zealy account",
      });
    }
  }

  // Synchroniser les points Zealy
  async syncPoints(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req.user as UserDocument)?._id;
      if (!userId) {
        res.status(400).json({ error: "User not authenticated" });
        return;
      }

      const updatedUser = await zealyService.syncUserPoints(userId.toString());
      res.json({
        success: true,
        points: {
          zealy: updatedUser.flexpoints_zealy,
          total: updatedUser.flexpoints_total,
        },
      });
    } catch (error: any) {
      logger.error("Zealy sync points error:", error);
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.message || "Failed to sync Zealy points",
      });
    }
  }
}

export default new ZealyController();
