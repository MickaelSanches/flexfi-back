// IMPORTANT: Import dotenv et chargement des variables d'environnement
// en premier, avant toute autre importation
import dotenv from 'dotenv';

// Charger les variables d'environnement en premier
dotenv.config();

// Ensuite seulement, importer les autres modules
import app from './app';
import { connectDatabase } from './config/database';

// Écraser explicitement la variable d'environnement si nécessaire
process.env.MONGODB_URI = 'mongodb+srv://henrilbhlb:BabyFace33@flexfidev.m4hdwkn.mongodb.net/flexfi?retryWrites=true&w=majority';

// Définir le port
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
const startServer = async () => {
  try {
    // Connexion à la base de données
    await connectDatabase();
    
    // Démarrer le serveur Express
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();