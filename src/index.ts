import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement selon l'environnement
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

import app from './app';
import { connectDatabase } from './config/database';
import logger from './utils/logger';

// Définir le port
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
const startServer = async () => {
  try {
    // Vérifier que la variable MONGODB_URI est définie
    if (!process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
      logger.error('MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }
    
    // Connexion à la base de données
    await connectDatabase();
    
    // Démarrer le serveur Express
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();