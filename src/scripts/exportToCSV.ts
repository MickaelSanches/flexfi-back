import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { User } from "../models/User";
import Card from "../models/Card";
import KYC from "../models/KYC";
import Wallet from "../models/Wallet";
import dotenv from "dotenv";

dotenv.config();

// Dossier où stocker les fichiers CSV
const EXPORT_DIR = path.join(__dirname, "../../exports");

// Fonction pour créer un CSV simple
function createCsv(headers: string[], data: any[]): string {
  const headerRow = headers.join(",");
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header] || "";
        // Si la valeur contient une virgule, l'entourer de guillemets
        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : value;
      })
      .join(",")
  );

  return [headerRow, ...rows].join("\n");
}

async function exportData() {
  try {
    // S'assurer que le dossier d'export existe
    if (!fs.existsSync(EXPORT_DIR)) {
      fs.mkdirSync(EXPORT_DIR, { recursive: true });
    }

    // Connexion à MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/flexfi"
    );
    console.log("Connected to MongoDB");

    // Date pour les noms de fichiers
    const dateStr = new Date().toISOString().split("T")[0];

    // Exporter les utilisateurs
    const users = await User.find().lean();
    const userHeaders = [
      "id",
      "email",
      "firstName",
      "lastName",
      "authMethod",
      "kycStatus",
      "walletCount",
      "createdAt",
    ];

    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      authMethod: user.authMethod,
      kycStatus: user.kycStatus,
      walletCount: user.wallets?.length || 0,
      //createdAt: user.createdAt?.toISOString() || ''
    }));

    const usersCsv = createCsv(userHeaders, formattedUsers);
    fs.writeFileSync(path.join(EXPORT_DIR, `users_${dateStr}.csv`), usersCsv);
    console.log(`Exported ${users.length} users to CSV`);

    // Exporter les cartes
    const cards = await Card.find().lean();
    const cardHeaders = ["id", "userId", "cardType", "status", "createdAt"];

    const formattedCards = cards.map((card) => ({
      id: card._id.toString(),
      userId: card.userId.toString(),
      cardType: card.cardType,
      status: card.status,
      createdAt: card.createdAt?.toISOString() || "",
    }));

    const cardsCsv = createCsv(cardHeaders, formattedCards);
    fs.writeFileSync(path.join(EXPORT_DIR, `cards_${dateStr}.csv`), cardsCsv);
    console.log(`Exported ${cards.length} cards to CSV`);

    // Exporter les KYC
    const kycs = await KYC.find().lean();
    const kycHeaders = ["id", "userId", "status", "createdAt", "updatedAt"];

    const formattedKycs = kycs.map((kyc) => ({
      id: kyc._id.toString(),
      userId: kyc.userId.toString(),
      status: kyc.status,
      createdAt: kyc.createdAt?.toISOString() || "",
      updatedAt: kyc.updatedAt?.toISOString() || "",
    }));

    const kycsCsv = createCsv(kycHeaders, formattedKycs);
    fs.writeFileSync(path.join(EXPORT_DIR, `kyc_${dateStr}.csv`), kycsCsv);
    console.log(`Exported ${kycs.length} KYC records to CSV`);

    // Exporter les wallets
    const wallets = await Wallet.find().lean();
    const walletHeaders = [
      "id",
      "userId",
      "publicKey",
      "type",
      "hasDelegation",
      "createdAt",
    ];

    const formattedWallets = wallets.map((wallet) => ({
      id: wallet._id.toString(),
      userId: wallet.userId.toString(),
      publicKey: wallet.publicKey,
      type: wallet.type,
      hasDelegation: wallet.hasDelegation ? "Yes" : "No",
      createdAt: wallet.createdAt?.toISOString() || "",
    }));

    const walletsCsv = createCsv(walletHeaders, formattedWallets);
    fs.writeFileSync(
      path.join(EXPORT_DIR, `wallets_${dateStr}.csv`),
      walletsCsv
    );
    console.log(`Exported ${wallets.length} wallets to CSV`);

    // Déconnexion de MongoDB
    await mongoose.disconnect();
    console.log("Data export completed successfully");
  } catch (error) {
    console.error("Error exporting data:", error);
    process.exit(1);
  }
}

// Exécuter l'export
exportData();
