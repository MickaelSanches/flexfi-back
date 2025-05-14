import axios from "axios";
import { zealyConfig } from "../config/zealy";
import { User } from "../models/User";
import logger from "../utils/logger";

async function syncZealyPoints() {
  try {
    // Récupérer tous les utilisateurs avec un zealy_id
    const users = await User.find({ zealy_id: { $exists: true } });

    for (const user of users) {
      try {
        // Récupérer les points Zealy
        const response = await axios.get(
          `${zealyConfig.apiUrl}/communities/${zealyConfig.communityId}/users/${user.zealy_id}`,
          {
            headers: {
              Authorization: `Bearer ${zealyConfig.apiKey}`,
            },
          }
        );

        const { points } = response.data;

        // Mettre à jour les points Zealy et totaux
        await User.findByIdAndUpdate(user._id, {
          $set: {
            zealy_id: user.zealy_id,
            discord_handle: user.discord_handle,
            flexpoints_zealy: points,
          },
        });

        // Ajouter les points Zealy
        await user.addZealyPoints(points);

        logger.info(`Points synchronisés pour l'utilisateur ${user._id}`);
      } catch (error) {
        logger.error(
          `Erreur lors de la synchronisation pour l'utilisateur ${user._id}:`,
          error
        );
      }
    }

    logger.info("Synchronisation des points Zealy terminée");
  } catch (error) {
    logger.error("Erreur lors de la synchronisation des points Zealy:", error);
  }
}

// Exécuter le script
syncZealyPoints();
