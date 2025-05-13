import mongoose from 'mongoose';
import logger from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    // En environnement de test, se connecter à la base de test
    if (process.env.NODE_ENV === 'test') {
      logger.info('Connecting to test database...');
      if (MONGODB_URI !== 'memory') {
        await mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/flexfi_test');
        logger.info('Connected to test database');
      } else {
        logger.info('Using in-memory database from MongoMemoryServer');
  
      }
    } else {
      // En production/développement, se connecter à la base principale
      logger.info('Connecting to MongoDB...');
      
      if (!MONGODB_URI) {
        logger.error('MONGODB_URI is not defined in environment variables');
        throw new Error('MONGODB_URI environment variable is not set');
      }
      
      await mongoose.connect(MONGODB_URI);
      logger.info('Connected to MongoDB successfully!');
    }
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    
    // Ne pas quitter en environnement de test, laisser le test gérer l'erreur
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw error;
    }
  }
};