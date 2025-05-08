import axios from "axios";
import { zealyConfig } from "../config/zealy";
import { User, UserDocument } from "../models/User";
import { InternalError, NotFoundError } from "../utils/AppError";
import logger from "../utils/logger";

export class ZealyService {
  // Verify Zealy code and update user
  async verifyAndUpdateUser(
    userId: string,
    verificationCode: string
  ): Promise<UserDocument> {
    try {
      // Verify code with Zealy
      const response = await axios.post(
        `${zealyConfig.apiUrl}/communities/${zealyConfig.communityId}/verify`,
        {
          code: verificationCode,
        },
        {
          headers: {
            Authorization: `Bearer ${zealyConfig.apiKey}`,
          },
        }
      );

      const { id, discordHandle, points } = response.data;

      // Update user
      const user = await User.findByIdAndUpdate(
        userId,
        {
          zealy_id: id,
          discord_handle: discordHandle,
          flexpoints_zealy: points,
          flexpoints_total: { $add: ["$flexpoints_native", points] },
        },
        { new: true }
      );

      if (!user) {
        throw NotFoundError("User not found");
      }

      return user;
    } catch (error: any) {
      logger.error("Zealy verification error:", error);
      if (error instanceof Error) throw error;
      throw InternalError(`Failed to verify Zealy account: ${error.message}`);
    }
  }

  // Synchronize Zealy points for a user
  async syncUserPoints(userId: string): Promise<UserDocument> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw NotFoundError("User not found");
      }

      if (!user.zealy_id) {
        throw NotFoundError("User has no Zealy account connected");
        // Implement a way to connect the user to Zealy
      }

      // Get Zealy points
      const response = await axios.get(
        `${zealyConfig.apiUrl}/communities/${zealyConfig.communityId}/users/${user.zealy_id}`,
        {
          headers: {
            Authorization: `Bearer ${zealyConfig.apiKey}`,
          },
        }
      );

      const { points } = response.data;

      // Update points
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          flexpoints_zealy: points,
          flexpoints_total: { $add: ["$flexpoints_native", points] },
        },
        { new: true }
      );

      if (!updatedUser) {
        throw NotFoundError("Failed to update user points");
      }

      return updatedUser;
    } catch (error: any) {
      logger.error("Zealy sync points error:", error);
      if (error instanceof Error) throw error;
      throw InternalError(`Failed to sync Zealy points: ${error.message}`);
    }
  }
}

export default new ZealyService();
