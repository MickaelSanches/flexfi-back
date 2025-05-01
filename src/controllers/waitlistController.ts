import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { IWaitlistUser } from "../models/WaitlistUser";
import waitlistService from "../services/waitlistService";
import { ConflictError } from "../utils/AppError";

export class WaitlistController {
  // Register a new user in the waitlist
  async registerWaitlistUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData: IWaitlistUser = {
        ...req.body,
        // Add technical information from headers
        deviceType: req.headers["sec-ch-ua-platform"]?.toString() || "desktop",
        browser: req.headers["user-agent"]?.toString() || "unknown",
        ipCity:
          req.headers["x-forwarded-for"]?.toString() ||
          req.socket.remoteAddress?.toString() ||
          "",
        deviceLocale: req.headers["accept-language"]?.toString() || "en-US",
      };

      const newWaitlistUser = await waitlistService.registerUser(userData);

      res.status(201).json({
        status: "success",
        data: newWaitlistUser,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        next(ConflictError("Email already exists"));
      } else {
        next(error);
      }
    }
  }

  // Get total number of users in the waitlist
  async getWaitlistCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const count = await waitlistService.getWaitlistCount();

      res.status(200).json({
        status: "success",
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get number of referrals linked to a code
  async getReferralCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code } = req.params;
      const referrals = await waitlistService.getReferralCount(code);

      res.status(200).json({
        status: "success",
        data: { code, referrals },
      });
    } catch (error) {
      next(error);
    }
  }

  // Export waitlist users to CSV
  async exportWaitlist(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let csvFilePath: string | null = null;
    try {
      const { path, filename } = await waitlistService.exportWaitlistToCSV();
      csvFilePath = path;

      res.download(path, filename, (err) => {
        if (err) {
          if (!res.headersSent) {
            res.status(500).json({
              status: "error",
              message: "Failed to download the file",
            });
          }
        }
      });
    } catch (error) {
      // Clean up file in case of error
      if (csvFilePath && fs.existsSync(csvFilePath)) {
        fs.unlinkSync(csvFilePath);
      }
      next(error);
    }
  }
}

export default new WaitlistController();
