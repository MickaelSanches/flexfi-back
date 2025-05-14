import axios from "axios";
import { zealyConfig } from "../config/zealy";
import { User, UserDocument } from "../models/User";
import { InternalError, NotFoundError } from "../utils/AppError";
import logger from "../utils/logger";

export class ZealyService {
  // Exchange OAuth code for token and update user
  async exchangeCodeForToken(
    code: string,
    userId: string
  ): Promise<UserDocument> {
    try {
      // Exchange code for token
      const tokenResponse = await axios.post(
        `${zealyConfig.apiUrl}/oauth/token`,
        {
          client_id: zealyConfig.clientId,
          client_secret: zealyConfig.clientSecret,
          code,
          redirect_uri: zealyConfig.redirectUri,
          grant_type: "authorization_code"
        }
      );

      const { access_token } = tokenResponse.data;

      if (!access_token) {
        throw InternalError("Failed to obtain access token from Zealy");
      }

      // Get user info using the token
      const userInfoResponse = await axios.get(
        `${zealyConfig.apiUrl}/user`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );

      const { id, discordHandle, points } = userInfoResponse.data;

      // Update user in database
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            zealy_id: id,
            discord_handle: discordHandle,
          }
        },
        { new: true }
      );

      if (!user) {
        throw NotFoundError("User not found");
      }

      // Update points using the model method
      return await user.setZealyPoints(points);
    } catch (error: any) {
      logger.error("Zealy OAuth token exchange error:", error);
      if (error instanceof Error) throw error;
      throw InternalError(`Failed to connect Zealy account: ${error.message}`);
    }
  }

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
          $set: {
            zealy_id: id,
            discord_handle: discordHandle,
          },
        },
        { new: true }
      );

      if (!user) {
        throw NotFoundError("User not found");
      }

      // Ajouter les points Zealy en utilisant la méthode du modèle
      return await user.addZealyPoints(points);
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

      // Update points using the model method
      return await user.setZealyPoints(points);
    } catch (error: any) {
      logger.error("Zealy sync points error:", error);
      if (error instanceof Error) throw error;
      throw InternalError(`Failed to sync Zealy points: ${error.message}`);
    }
  }
}

export default new ZealyService();
