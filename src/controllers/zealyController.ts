import { NextFunction, Request, Response } from "express";
import { zealyConfig } from "../config/zealy";
import { UserDocument } from "../models/User";
import zealyService from "../services/zealyService";
import logger from "../utils/logger";
import { generateOAuthState, verifyOAuthState, checkRateLimit } from "../utils/zealyUtils";

export class ZealyController {
  // Rediriger vers la page de connexion Zealy via OAuth
  async connect(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as UserDocument)?._id;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      // Check rate limit
      if (!checkRateLimit(userId.toString())) {
        res.status(429).json({ error: "Too many requests, please try again later" });
        return;
      }

      // Generate secure state with user ID
      const state = generateOAuthState(userId.toString());

      // Construct the OAuth authorization URL
      const authUrl = new URL(`${zealyConfig.apiUrl}/oauth/authorize`);
      authUrl.searchParams.append("client_id", zealyConfig.clientId);
      authUrl.searchParams.append("redirect_uri", zealyConfig.redirectUri);
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("scope", zealyConfig.scopes.join(" "));
      authUrl.searchParams.append("state", state);

      logger.info(`Redirecting user ${userId} to Zealy OAuth: ${authUrl}`);
      res.redirect(authUrl.toString());
    } catch (error: any) {
      logger.error("Zealy connect error:", error);
      res.status(500).json({
        error: "Failed to connect to Zealy"
      });
    }
  }

  // Gérer le callback de Zealy
  async callback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const code = req.query.code as string;
      const state = req.query.state as string;

      if (!code) {
        res.status(400).json({ error: "Authorization code is required" });
        return;
      }

      if (!state) {
        res.status(400).json({ error: "State parameter is missing" });
        return;
      }

      // Verify state and extract user ID
      const userId = verifyOAuthState(state);
      if (!userId) {
        res.status(401).json({ error: "Invalid or expired authorization state" });
        return;
      }

      // Check rate limit
      if (!checkRateLimit(userId)) {
        res.status(429).json({ error: "Too many requests, please try again later" });
        return;
      }

      const user = await zealyService.exchangeCodeForToken(code, userId);

      // Redirect to frontend with success message
      const redirectUrl = new URL(zealyConfig.frontendRedirectUrl);
      redirectUrl.searchParams.append("status", "success");
      redirectUrl.searchParams.append("zealy_points", user.flexpoints_zealy.toString());
      redirectUrl.searchParams.append("total_points", user.flexpoints_total.toString());
      
      res.redirect(redirectUrl.toString());
    } catch (error: any) {
      logger.error("Zealy callback error:", error);
      
      // Redirect to frontend with error message
      const redirectUrl = new URL(zealyConfig.frontendRedirectUrl);
      redirectUrl.searchParams.append("status", "error");
      redirectUrl.searchParams.append("message", error.message || "Failed to connect Zealy account");
      
      res.redirect(redirectUrl.toString());
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
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      // Check rate limit
      if (!checkRateLimit(userId.toString())) {
        res.status(429).json({ error: "Too many requests, please try again later" });
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
