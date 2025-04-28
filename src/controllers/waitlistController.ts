import { Request, Response } from "express";
import waitlistService from "../services/waitlistService";

export class WaitlistController {
  // Enregistrer un utilisateur dans la waitlist
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const newWaitlistUser = await waitlistService.registerUser(userData);

      res.status(201).json({
        status: "success",
        data: newWaitlistUser,
      });
    } catch (error: any) {
      // Vérifier si c'est une erreur de duplication MongoDB
      if (error.code === 11000 && error.keyPattern?.email) {
        res.status(400).json({
          status: "error",
          message: "This email is already in use",
        });
        return;
      }

      // Pour les autres erreurs
      console.error("Error registering user:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while registering the user",
      });
    }
  }

  // Retourner le nombre total d'utilisateurs dans la waitlist
  async getWaitlistCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await waitlistService.getWaitlistCount();

      res.status(200).json({
        status: "success",
        data: { count },
      });
    } catch (error) {
      console.error("Error fetching waitlist count:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while fetching the waitlist count",
      });
    }
  }

  // Récupérer le nombre de parrainages liés à un code
  async getReferralCount(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      const referrals = await waitlistService.getReferralCount(code);

      res.status(200).json({
        status: "success",
        data: { code, referrals },
      });
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while fetching referrals",
      });
    }
  }

  // Exporter les utilisateurs de la waitlist en CSV
  async exportWaitlist(req: Request, res: Response): Promise<void> {
    try {
      const csvFilePath = await waitlistService.exportWaitlistToCSV();

      // Extraire le nom du fichier depuis le chemin
      const fileName = csvFilePath.split("/").pop() || "waitlist.csv";

      res.download(csvFilePath, fileName, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).json({
            status: "error",
            message: "Failed to download the file",
          });
        }
      });
    } catch (error) {
      console.error("Error exporting waitlist:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while exporting the waitlist",
      });
    }
  }
}

export default new WaitlistController();
